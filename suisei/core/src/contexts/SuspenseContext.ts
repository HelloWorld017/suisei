import { createContext } from './utils';
import type { Element } from '../types';

export type SuspenseContextType = {
  fallback: Element;
  element: Element;
};

export const [SuspenseContext, SuspenseContextProvider] = createContext(
  null as null | SuspenseContextType
);
