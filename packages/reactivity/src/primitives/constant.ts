import { SymbolIs, SymbolRef, SymbolRefDescriptor } from '@suisei/shared';
import type { ConstantRef, Owner } from '../types';

export const constant =
  (owner: Owner): PrimitiveConstant =>
  constantValue => ({
    [SymbolIs]: SymbolRef,
    [SymbolRefDescriptor]: {
      id: owner.stateCount++,
      isConstant: true,
      raw: constantValue,
      from: owner,
    },
  });

export type PrimitiveConstant = <T>(constantValue: T) => ConstantRef<T>;
