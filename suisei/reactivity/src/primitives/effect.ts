import { isPromise } from '@suisei/shared';
import {
  Effect,
  EffectCleanup,
  EffectHandle,
  Owner,
  Ref,
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
    let currentAbortController: AbortController | null = null;

    const refCleanups = new Map<Ref<unknown>, () => void>();
    const runEffect = () => {
      if (currentTaskId !== null) {
        return;
      }

      if (currentPromise) {
        currentAbortController?.abort();
        currentPromise
          .then(async () => {
            try {
              await currentCleanup?.();
              runEffect();
            } catch (error) {
              owner.onError(error);
            }
          })
          .catch(() => {});
        return;
      }

      const cleanupFn = currentCleanup;
      currentTaskId = owner.scheduler.queueTask(async () => {
        currentTaskId = null;
        currentAbortController =
          typeof AbortController !== undefined ? new AbortController() : null;

        const effectHandle = {
          abortSignal: currentAbortController?.signal as AbortSignal,
        };

        if (cleanupFn) {
          try {
            await cleanupFn();
          } catch (error) {
            owner.onError(error);
          }
        }

        const selector: RefSelector = ref => {
          if (refCleanups.has(ref as Ref<unknown>)) {
            return readRef(owner, ref);
          }

          const [value, cleanup] = observeRef(owner, ref, runEffect);
          refCleanups.set(ref as Ref<unknown>, cleanup);

          return value;
        };

        let newCleanup;
        try {
          newCleanup = effectFn(selector, effectHandle);
        } catch (error) {
          owner.onError(error);
          newCleanup = undefined;
        }

        if (isPromise<void | EffectCleanup>(newCleanup)) {
          currentPromise = newCleanup
            .then(
              awaitedNewCleanup => {
                currentCleanup = awaitedNewCleanup || null;
              },
              error => {
                owner.onError(error);
              }
            )
            .finally(() => {
              currentAbortController = null;
              currentPromise = null;
            });
        } else if (newCleanup) {
          currentAbortController = null;
          currentCleanup = newCleanup;
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

      return async () => {
        refCleanups.forEach(refCleanup => refCleanup());

        if (currentPromise) {
          currentAbortController?.abort();
          try {
            await currentPromise;
          } catch (error) {
            owner.onError(error);
            return;
          }
        }

        try {
          await currentCleanup?.();
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
