import { Ref } from 'suisei';
import type {
  EffectCleanup,
  EffectRunAt,
  Owner,
  Scheduler,
  Task,
} from 'suisei/unsafe-internals';

export const createOwner = (scheduler: Scheduler): Owner => {
  let pendingUpdates = new Map<Ref, Task>();
  let pendingEffects: Task[] = [];
  let pendingLayoutEffects: Task[] = [];

  const addEffectTask = (runAt: EffectRunAt, effectTask: Task) => {
    if (runAt === 'layout') {
      pendingLayoutEffects.push(effectTask);
      return;
    }

    pendingEffects.push(effectTask);
  };

  const assignUpdatesToScheduler = (callback: () => void) => {
    const currentlyAssignedTasks = pendingUpdates;
    pendingUpdates = new Map();

    currentlyAssignedTasks.forEach(task => scheduler.queueTask(task));
    scheduler.queueTask(() => {
      if (pendingUpdates.size > 0) {
        return assignUpdatesToScheduler(callback);
      }

      callback();
    });
  };

  const assignLayoutEffectsToScheduler = (callback: () => void) => {
    const currentlyAssignedLayoutEffects = pendingLayoutEffects;
    pendingLayoutEffects = [];

    currentlyAssignedLayoutEffects.forEach(task => scheduler.queueTask(task));
    assignUpdatesToScheduler(() =>
      scheduler.queueTask(() => {
        if (pendingLayoutEffects.length > 0) {
          return assignLayoutEffectsToScheduler(callback);
        }

        callback();
      })
    );
  };

  const assignEffectsToScheduler = (callback: () => void) => {
    const currentlyAssignedEffects = pendingEffects;
    pendingEffects = [];

    currentlyAssignedEffects.forEach(task => scheduler.queueTask(task));
    assignLayoutEffectsToScheduler(() =>
      scheduler.queueTask(() => {
        if (pendingEffects.length > 0) {
          return assignEffectsToScheduler(callback);
        }

        callback();
      })
    );
  };

  const cleanups: EffectCleanup[] = [];

  return {
    stateCount: 0,
    onStateUpdate(ref, _flags, runUpdate) {
      pendingUpdates.set(ref, runUpdate);
    },
    onDeriveUpdateByObserve(ref, _flags, runDerive) {
      pendingUpdates.set(ref, runDerive);
    },
    onEffectInitialize(runAt, runEffect) {
      addEffectTask(runAt, () => {
        cleanups.push(runEffect());
      });
    },
    onEffectUpdate: addEffectTask,
    onFutureInitialize(promise, cleanup) {
      // TODO
      cleanups.push(cleanup);
    },
    onFutureUpdate(promise, _flags) {
      // TODO
    },
    onError(error) {
      // TODO
    },
  };
};
