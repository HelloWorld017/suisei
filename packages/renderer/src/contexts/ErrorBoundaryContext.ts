import { createContext } from '@suisei/core';
import type { Ref } from '@suisei/reactivity';

export type ErrorBoundaryContextType = {
  latestError: Ref<{ error: unknown } | null>;
};

export const ErrorBoundaryContext =
  createContext<ErrorBoundaryContextType | null>(null);
