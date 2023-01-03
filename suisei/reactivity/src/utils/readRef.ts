import {
  isConstantOrVariableRef,
  shallowCompare,
  SymbolMemoizedValue,
  SymbolRefDescriptor,
} from '@suisei/shared';
import { InternalRef, Owner, Ref, RefSelector } from '../types';

export const readRef = <T>(owner: Owner, target: Ref<T>): T => {
  const readRefWithOwner = <T>(target: Ref<T>) => readRef(owner, target);
  const ref = target as InternalRef<T>;

  if (isConstantOrVariableRef<T>(ref)) {
    return ref[SymbolRefDescriptor].raw;
  }

  const memoized = ref[SymbolMemoizedValue];
  if (memoized) {
    // Ensured latest value (by observeRef())
    if (memoized.observed) {
      return memoized.value;
    }

    const isLatest = shallowCompare(
      memoized.refs.map(readRefWithOwner),
      memoized.refValues
    );

    if (isLatest) {
      return memoized.value;
    }
  }

  const selectedRefs: Ref[] = [];
  const selectedRefValues: unknown[] = [];
  let selectorImpl: RefSelector = ref => {
    const values = readRef(owner, ref);
    selectedRefs.push(ref);
    selectedRefValues.push(values);

    return values;
  };

  const selector: RefSelector = ref => selectorImpl(ref);
  const output = ref(selector);
  selectorImpl = readRefWithOwner;

  ref[SymbolMemoizedValue] = {
    refs: selectedRefs,
    refValues: selectedRefValues,
    value: output,
    observed: false,
  };

  return output;
};
