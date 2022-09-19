import { isPromise } from '@suisei/shared';
import {
  Effect,
  EffectCleanup,
  EffectHandle,
  Owner,
  Ref,
  RefOrRefs,
  RefSelector,
} from '../types';
import { observeRef, readRef } from '../utils';

type EffectFn = (
  selector: RefSelector,
  effectHandle: EffectHandle
) => void | EffectCleanup | Promise<void | EffectCleanup>;

type EffectOption = { runAt?: 'sync' };

export const effect =
  (owner: Owner): PrimitiveEffect =>
  (effectFn, options?) => {
    let currentTaskId: number | null = null;
    let currentCleanup: EffectCleanup | null = null;
    let currentPromise: Promise<void | EffectCleanup> | null = null;

    let isCancelled = false;
    const effectHandle: EffectHandle = {
      isCancelled: () => isCancelled,
    };

    const refCleanups = new Map<Ref<unknown>, () => void>();
    const runEffect = () => {
      if (currentTaskId !== null) {
        return;
      }

      if (currentPromise) {
        isCancelled = true;

        currentPromise
          .then(() => {
            try {
              currentCleanup?.();
              runEffect();
            } catch (error) {
              owner.onError(error);
            }
          })
          .catch(() => {});
        return;
      }

      const cleanupFn = currentCleanup;
      currentTaskId = owner.scheduler.queueTask(() => {
        isCancelled = false;
        currentTaskId = null;

        try {
          if (cleanupFn) {
            cleanupFn();
          }

          const unusedDependencies = new Set(refCleanups.keys());
          const selector: RefSelector = (refOrRefs: RefOrRefs) => {
            if (Array.isArray(refOrRefs)) {
              return refOrRefs.map(selector);
            }

            if (refCleanups.has(refOrRefs)) {
              unusedDependencies.delete(refOrRefs);
              return readRef(refOrRefs);
            }

            const [value, cleanup] = observeRef(owner, refOrRefs, runEffect);
            refCleanups.set(refOrRefs, cleanup);

            return value;
          };

          const newCleanup = effectFn(selector, effectHandle);
          unusedDependencies.forEach(dependency => {
            refCleanups.get(dependency)?.();
            refCleanups.delete(dependency);
          });

          if (isPromise<void | EffectCleanup>(newCleanup)) {
            currentPromise = newCleanup.then(awaitedNewCleanup => {
              currentPromise = null;
              currentCleanup = awaitedNewCleanup || null;
            });
          } else if (newCleanup) {
            currentCleanup = newCleanup;
          }
        } catch (error) {
          owner.onError(error);
        }
      });
    };

    const initialize = (effect: Effect) => {
      options?.runAt === 'sync'
        ? owner.onEffectSyncInitialize(effect)
        : owner.onEffectInitialize(effect);
    };

    initialize(() => {
      runEffect();

      return () => {
        refCleanups.forEach(refCleanup => refCleanup());

        if (currentPromise) {
          isCancelled = true;
          return currentPromise.then(() => {
            try {
              currentCleanup?.();
            } catch (error) {
              owner.onError(error);
            }
          });
        }

        try {
          currentCleanup?.();
        } catch (error) {
          owner.onError(error);
        }
      };
    });
  };

export type PrimitiveEffect = (
  effectFn: EffectFn,
  options?: EffectOption
) => void;

export const effectSync =
  (owner: Owner): PrimitiveEffectSync =>
  (effectFn, options) =>
    effect(owner)(effectFn, { ...options, runAt: 'sync' });

export type PrimitiveEffectSync = (
  effectFn: EffectFn,
  options?: Omit<EffectOption, 'runAt'>
) => void;
