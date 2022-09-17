import {
  isConstantOrVariableRef,
  shallowCompare,
  SymbolMemoizedValue,
  SymbolRefDescriptor,
} from '@suisei/shared';
import { Ref, RefOrRefs, RefSelector } from '../types';

export const readRef = <T>(ref: Ref<T>): T => {
  if (isConstantOrVariableRef<T>(ref)) {
    return ref[SymbolRefDescriptor].raw;
  }

  const memoized = ref[SymbolMemoizedValue];
  if (memoized) {
    if (memoized.observed) {
      // Ensured latest value (by observeRef())
      return memoized.value;
    }

    if (shallowCompare(memoized.refs.map(readRef), memoized.refValues)) {
      return memoized.value;
    }
  }

  const selectedRefs: Ref<any>[] = [];
  const selectedRefValues: any[] = [];
  const selector: RefSelector = (refOrRefs: RefOrRefs) => {
    if (Array.isArray(refOrRefs)) {
      return refOrRefs.map(selector);
    }

    const values = readRef(refOrRefs);
    selectedRefs.push(refOrRefs);
    selectedRefValues.push(values);

    return values;
  };

  const output = ref(selector);
  ref[SymbolMemoizedValue] = {
    refs: selectedRefs,
    refValues: selectedRefValues,
    value: output,
    observed: false,
  };

  return output;
};
