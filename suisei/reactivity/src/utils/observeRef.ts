import {
  isConstantRef,
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

  let hasActiveTask = false;
  const update = () => {
    const oldMemo = ref[SymbolMemoizedValue];
    const newMemo = ((): DerivedRefObservedMemo<T | undefined> => {
      if (oldMemo?.observed) {
        return oldMemo;
      }

      return { value: undefined, refCleanups: new Map(), observed: true };
    })();

    const subscribe = (newValue: unknown, flags: number) => {
      if (hasActiveTask) {
        return;
      }

      owner.scheduler.queueTask(() => {
        hasActiveTask = false;
        update();
      });
    };

    const selector: RefSelector = ref => {
      if (newMemo.refCleanups.has(ref as Ref<unknown>)) {
        return readRef(owner, ref);
      }

      const [value, cleanup] = observeRef(owner, ref, subscribe);
      newMemo.refCleanups.set(ref as Ref<unknown>, cleanup);

      return value;
    };

    const result = ref(selector);
    newMemo.value = result;
    ref[SymbolMemoizedValue] = newMemo as DerivedRefObservedMemo<T>;

    if (oldMemo && oldMemo.value !== newMemo.value) {
      const observers = ref[SymbolObservers];
      if (observers) {
        observers.forEach(observer => observer(result));
      }
    }

    return result;
  };

  ref[SymbolObservers] = new Set([observer]);
  return [update(), unsubscribe];
};
