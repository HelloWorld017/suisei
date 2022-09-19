import {
  SymbolIs,
  SymbolRef,
  SymbolRefDescriptor,
  SymbolObservers,
} from '@suisei/shared';
import { Owner, VariableRef } from '../types';

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
      owner.onStateUpdate(ref, 0);
      ref[SymbolRefDescriptor].raw = newValue;
      ref[SymbolObservers].forEach(observer => {
        observer(newValue);
      });
    };

    return [ref, setValue];
  };

export type PrimitiveState = <T>(
  initialValue: T
) => [VariableRef<T>, (newValue: T) => void];
