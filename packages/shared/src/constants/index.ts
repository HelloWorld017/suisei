import type { ErrorCode } from '../types/ErrorCode';

// Errors
export const E_INTERNAL_UNSUPPORTED_OPERATION = -1 as ErrorCode;

// Kinds
export const KIND_REF = 0;

// Ref Kinds
export const REF_KIND_STATE = 0;
export const REF_KIND_DERIVED = 1;

// Symbols
export * from './symbols';
