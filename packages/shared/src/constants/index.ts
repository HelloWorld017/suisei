import type { ErrorCode } from '../types/ErrorCode';

// Errors
export const E_INTERNAL_UNSUPPORTED_OPERATION = -1 as ErrorCode;

// Kinds
export const KIND_REF = 0;
export const KIND_ELEMENT = 1;
export const KIND_CONTINUATION = 2;
export const KIND_CONTEXT = 3;

// Ref Kinds
export const REF_KIND_STATE = 0;
export const REF_KIND_DERIVED = 1;
export const REF_KIND_CONSTANT = 2;

// Continuation Kinds
export const CONTINUATION_KIND_WAIT = 0;

// Symbols
export * from './symbols';
