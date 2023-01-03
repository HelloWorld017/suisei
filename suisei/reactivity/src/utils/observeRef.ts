import {
  isConstantRef,
  isPromise,
  isVariableRef,
  SymbolMemoizedValue,
  SymbolObservers,
  SymbolRefDescriptor,
} from '@suisei/shared';

import {
  DerivedRefObservedMemo,
  InternalRef,
  Owner,
  Ref,
  RefObserver,
  RefSelector,
} from '../types';

import { readRef } from './readRef';

export const observeRef = <T>(
  owner: Owner,
  target: Ref<T>,
  observer: RefObserver<T>
): [T, () => void] => {
  const ref = target as InternalRef<T>;

  if (isConstantRef<T>(ref)) {
    return [ref[SymbolRefDescriptor].raw, () => {}];
  }

  if (isVariableRef<T>(ref)) {
    ref[SymbolObservers].add(observer);
    return [
      ref[SymbolRefDescriptor].raw,
      () => ref[SymbolObservers].delete(observer),
    ];
  }

  const unsubscribe = () => {
    const observers = ref[SymbolObservers];
    if (!observers) {
      return;
    }

    observers.delete(observer);
    if (observers.size !== 0) {
      return;
    }

    const memo = ref[SymbolMemoizedValue];
    if (!memo?.observed) {
      return;
    }

    memo.refCleanups.forEach(cleanup => cleanup());
    delete ref[SymbolMemoizedValue];
  };

  const observers = ref[SymbolObservers];
  const memo = ref[SymbolMemoizedValue];
  if (observers && memo?.observed) {
    observers.add(observer);
    return [memo.value, unsubscribe];
  }

  let currentTaskId: number | null = null;
  const update = () => {
    const oldMemo = ref[SymbolMemoizedValue];
    const newMemo = ((): DerivedRefObservedMemo<T | undefined> => {
      if (oldMemo?.observed) {
        return oldMemo;
      }

      return { value: undefined, refCleanups: new Map(), observed: true };
    })();

    const subscribe = () => {
      if (currentTaskId === null) {
        currentTaskId = owner.scheduler.queueTask(() => {
          currentTaskId = null;
          update();
        });
      }
    };

    const unusedDependencies = new Set(newMemo.refCleanups.keys());
    const selector: RefSelector = ref => {
      if (newMemo.refCleanups.has(ref as Ref<unknown>)) {
        unusedDependencies.delete(ref as Ref<unknown>);
        return readRef(owner, ref);
      }

      const [value, cleanup] = observeRef(owner, ref, subscribe);
      newMemo.refCleanups.set(ref as Ref<unknown>, cleanup);

      return value;
    };

    const result = ref(selector);

    const removeUnusedDependenciesObserver = () => {
      unusedDependencies.forEach(dependency => {
        newMemo.refCleanups.get(dependency)?.();
        newMemo.refCleanups.delete(dependency);
      });
    };

    if (isPromise(result)) {
      // Add refs after await to the dependencies.
      // But don't catch and report to the owner here,
      // as the user may want something like $(_ => Promise.reject())

      result.finally(() => {
        // Update the value first, and remove unused dependencies later.
        // Watch out for the race condition.
        // > There might be no consistent view (time slice) for refs.
        // > Example
        // >> UpdateA: reads refA@0 refB@0, awaits for a sec, reads refC@2
        // >> UpdateB: reads refA@1 refB@1, does not await,   reads refC@1
        // >> UpdateC: awaits for a sec, only reads refB@2
        // >
        // > Then what refs should be unobserved might be confusing
        // We take a simple
        removeUnusedDependenciesObserver();
      });
    } else {
      removeUnusedDependenciesObserver();
    }

    newMemo.value = result;
    ref[SymbolMemoizedValue] = newMemo as DerivedRefObservedMemo<T>;

    if (oldMemo && oldMemo.value !== newMemo.value) {
      const observers = ref[SymbolObservers];
      if (observers) {
        observers.forEach(observer => observer(result));
      }
    }

    return oldMemo?.value as T;
  };

  ref[SymbolObservers] = new Set([observer]);
  return [update(), unsubscribe];
};
