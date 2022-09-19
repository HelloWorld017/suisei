import type { Owner } from './Owner';
import type {
  SymbolIs,
  SymbolMemoizedValue,
  SymbolObservers,
  SymbolRef,
  SymbolRefDescriptor,
} from '@suisei/shared';

export type RefObserver<T> = (newValue: T) => void;
export type RefSelector = <T>(ref: Ref<T>) => T;
export type RefDerivator<T> = (_: RefSelector) => T;

export type VariableRef<T> = {
  [SymbolIs]: typeof SymbolRef;
  [SymbolRefDescriptor]: {
    id: number;
    isConstant: false;
    raw: T;
    from: Owner | null;
  };
  [SymbolObservers]: Set<RefObserver<T>>;
};

export type ConstantRef<T> = {
  [SymbolIs]: typeof SymbolRef;
  [SymbolRefDescriptor]: {
    id: number;
    isConstant: true;
    raw: T;
    from: Owner | null;
  };
};

export type DerivedRefObservedMemo<T> = {
  value: T;
  refCleanups: Map<Ref<unknown>, () => void>;
  observed: true;
};

export type DerivedRefUnobservedMemo<T> = {
  value: T;
  refs: Ref<unknown>[];
  refValues: unknown[];
  observed: false;
};

export type DerivedRef<T> = RefDerivator<T> & {
  [SymbolIs]: typeof SymbolRef;
  [SymbolMemoizedValue]?:
    | DerivedRefObservedMemo<T>
    | DerivedRefUnobservedMemo<T>;
  [SymbolObservers]?: Set<RefObserver<T>>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Ref<T = any> = VariableRef<T> | ConstantRef<T> | DerivedRef<T>;
export type ExtractRef<R extends Ref> = R extends Ref<infer T> ? T : never;

export type PackToRef<R> = R extends Ref<unknown> ? R : Ref<R>;
