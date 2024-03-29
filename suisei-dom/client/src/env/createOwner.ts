import { cleanupAll } from '@suisei-dom/shared';
import type { Ref } from 'suisei';
import type {
  EffectCleanup,
  EffectRunAt,
  Owner,
  Scheduler,
  Task,
} from 'suisei/unsafe-internals';

type TaskLayer<K = unknown> = {
  commit(callback?: () => void): void;
  scheduleTask(task: Task, key?: K): void;
  hasTask(): boolean;
};

const createTaskLayer = <K = unknown>(
  scheduler: Scheduler,
  previousLayer?: TaskLayer<unknown>
): TaskLayer<K> => {
  let maxTaskId = 0;
  let pendingUpdates = new Map<K | number, Task>();

  const scheduleTask = (task: Task, key?: K) => {
    pendingUpdates.set(key ?? maxTaskId, task);
    maxTaskId += 1;
  };

  const hasTask = () => pendingUpdates.size > 0;

  const commit = (callback: () => void) => {
    const currentlyAssignedTasks = pendingUpdates;
    pendingUpdates = new Map();
    maxTaskId = 0;

    currentlyAssignedTasks.forEach(task => scheduler.queueTask(task));
    scheduler.queueTask(() => {
      if (previousLayer?.hasTask()) {
        previousLayer.commit(() => commit(callback));
        return;
      }

      if (hasTask()) {
        commit(callback);
        return;
      }

      callback?.();
    });
  };

  return { commit, scheduleTask, hasTask };
};

const createUpdater = (scheduler: Scheduler, update: () => void) => {
  let isDirty = false;
  const markAsDirty = () => {
    if (isDirty) {
      return;
    }

    isDirty = true;
    scheduler.queueTask(() => {
      isDirty = false;
      update();
    });
  };

  return markAsDirty;
};

export const createOwner = (
  scheduler: Scheduler,
  onSuspense: (futureSymbol: symbol, promise: Promise<unknown>) => void,
  onError: (error: unknown) => void
): [Owner, EffectCleanup] => {
  const updateLayer = createTaskLayer<Ref>(scheduler);
  const layoutEffectLayer = createTaskLayer(scheduler, updateLayer);
  const defaultEffectLayer = createTaskLayer(scheduler, layoutEffectLayer);

  const effectLayers: Record<EffectRunAt, TaskLayer> = {
    layout: layoutEffectLayer,
    default: defaultEffectLayer,
  };

  const markAsDirty = createUpdater(scheduler, () => {
    updateLayer.commit(() => {
      layoutEffectLayer.commit(() => {
        defaultEffectLayer.commit();
      });
    });
  });

  const cleanups: EffectCleanup[] = [];
  const owner: Owner = {
    stateCount: 0,
    onStateUpdate(ref, _flags, runUpdate) {
      updateLayer.scheduleTask(runUpdate, ref);
      markAsDirty();
    },

    onDeriveUpdateByObserve(ref, _flags, runDerive) {
      updateLayer.scheduleTask(runDerive, ref);
      markAsDirty();
    },

    onEffectInitialize(runAt, runEffect) {
      effectLayers[runAt].scheduleTask(() => {
        cleanups.push(runEffect());
      });
      markAsDirty();
    },

    onEffectUpdate(runAt, runUpdate) {
      effectLayers[runAt].scheduleTask(runUpdate);
      markAsDirty();
    },

    onFutureInitialize(futureSymbol, promise, cleanup) {
      onSuspense(futureSymbol, promise);
      cleanups.push(cleanup);
    },

    onFutureUpdate(futureSymbol, promise, _flags) {
      // FIXME check for defer flag
      onSuspense(futureSymbol, promise);
    },

    onError(error) {
      onError(error);
    },
  };

  return [owner, cleanupAll(cleanups)];
};
