import {
  SymbolIs,
  SymbolRef,
  SymbolRefDescriptor,
  SymbolObservers,
} from '@suisei/shared';
import type { Owner, Ref, VariableRef } from '../types';

export const state =
  (owner: Owner): PrimitiveState =>
  <T>(initialValue: T) => {
    const ref: VariableRef<T> = {
      [SymbolIs]: SymbolRef,
      [SymbolRefDescriptor]: {
        id: owner.stateCount++,
        isConstant: false,
        raw: initialValue,
        from: owner,
      },
      [SymbolObservers]: new Set(),
    };

    const setValue = (newValue: T): void => {
      if (newValue === ref[SymbolRefDescriptor].raw) {
        return;
      }

      // FIXME Add flag for defer()
      const flags = 0;

      owner.onStateUpdate(ref, flags);
      ref[SymbolRefDescriptor].raw = newValue;
      ref[SymbolObservers].forEach(observer => {
        observer(newValue, flags);
      });
    };

    return [ref, setValue];
  };

export type PrimitiveState = <T>(
  initialValue: T
) => [Ref<T>, (newValue: T) => void];
