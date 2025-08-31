import type {
  KIND_FUTURE,
  SymbolFutureDescriptor,
  SymbolIs,
} from '@suisei/shared';

export type Future<T = unknown> = {
  __type?: T;
  [SymbolIs]: typeof KIND_FUTURE;
};

export type FutureUnresolvedInternal<T = unknown> = Future<T> & {
  [SymbolFutureDescriptor]: {
    handlers: ((value: T) => void)[];
    value?: undefined;
  };
};

export type FutureResolvedInternal<T = unknown> = Future<T> & {
  [SymbolFutureDescriptor]: {
    handlers?: undefined;
    value: T;
  };
};

export type FutureInternal<T = unknown> =
  | FutureUnresolvedInternal<T>
  | FutureResolvedInternal<T>;

export type UnwrapFuture<T> = T extends Future<infer TAwaited> ? TAwaited : T;
