import type { ErrorCode } from '../types/ErrorCode';

// Kinds
export const KIND_REF = 0;

// Ref Kinds
export const REF_KIND_STATE = 0;
export const REF_KIND_DERIVED = 1;

// Error Codes
export const E_STATE_NOT_IN_REGISTRY = 0 as ErrorCode;

// Symbols
export * from './symbols';
