import {
  KIND_FUTURE,
  KIND_REF,
  REF_KIND_CONSTANT,
  REF_KIND_DERIVED,
  REF_KIND_STATE,
  SymbolIs,
  SymbolRefDescriptor,
} from '@suisei/shared';
import type { Future } from '../types/Future';
import type {
  ConstantRefInternal,
  DerivedRefInternal,
  Ref,
  RefInternal,
  StateRefInternal,
} from '../types/Ref';

export const isRef = <T = unknown>(ref: unknown): ref is Ref<T> =>
  typeof ref === 'object' &&
  !!ref &&
  SymbolIs in ref &&
  ref[SymbolIs] === KIND_REF;

export const isDerivedRefInternal = <T>(
  ref: Ref<T>
): ref is DerivedRefInternal<T> =>
  (ref as RefInternal<T>)[SymbolRefDescriptor].kind === REF_KIND_DERIVED;

export const isStateRefInternal = <T>(
  ref: Ref<T>
): ref is StateRefInternal<T> =>
  (ref as RefInternal<T>)[SymbolRefDescriptor].kind === REF_KIND_STATE;

export const isConstantRefInternal = <T>(
  ref: Ref<T>
): ref is ConstantRefInternal<T> =>
  (ref as RefInternal<T>)[SymbolRefDescriptor].kind === REF_KIND_CONSTANT;

export const isFuture = <T = unknown>(future: unknown): future is Future<T> =>
  typeof future === 'object' &&
  !!future &&
  SymbolIs in future &&
  future[SymbolIs] === KIND_FUTURE;
