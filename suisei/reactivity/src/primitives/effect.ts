import { isPromise } from '@suisei/shared';
import {
  EffectCleanup,
  EffectHandle,
  EffectRunAt,
  Owner,
  Ref,
  RefSelector,
} from '../types';
import { observeRef, readRef } from '../utils';

type EffectFn = (
  selector: RefSelector,
  effectHandle: EffectHandle
) => void | EffectCleanup | Promise<void | EffectCleanup>;

type EffectOption = { runAt?: EffectRunAt };

export const effect =
  (owner: Owner): PrimitiveEffect =>
  (effectFn, options?) => {
    let hasActiveTask = false;
    let currentCleanup: EffectCleanup | null = null;
    let currentPromise: Promise<void | EffectCleanup> | null = null;
    let currentAbortController: AbortController | null = null;

    const runAt = options?.runAt ?? 'default';
    const refCleanups = new Map<Ref<unknown>, () => void>();
    const runEffect = () => {
      if (hasActiveTask) {
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
      hasActiveTask = true;
      owner.onEffectUpdate(runAt, async () => {
        hasActiveTask = false;
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

    owner.onEffectInitialize(runAt, () => {
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

export const effectLayout =
  (owner: Owner): PrimitiveEffectLayout =>
  (effectFn, options) =>
    effect(owner)(effectFn, { ...options, runAt: 'layout' });

export type PrimitiveEffectLayout = (
  effectFn: EffectFn,
  options?: Omit<EffectOption, 'runAt'>
) => void;
