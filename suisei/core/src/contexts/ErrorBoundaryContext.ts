import { createContext } from './utils';

export type ErrorBoundaryContextType = (error: unknown) => void;

export const [ErrorBoundaryContext, ErrorBoundaryContextProvider] =
  createContext(null as null | ErrorBoundaryContextType);
