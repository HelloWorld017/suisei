import type {
  CONTINUATION_KIND_WAIT,
  KIND_CONTINUATION,
  SymbolIs,
} from '@suisei/shared';

export type Continuation = {
  [SymbolIs]: typeof KIND_CONTINUATION;
};

export type ContinuationInternal = WaitContinuationInternal;

export type WaitContinuationInternal = Continuation & {
  kind: typeof CONTINUATION_KIND_WAIT;
  promise: Promise<unknown>;
};
