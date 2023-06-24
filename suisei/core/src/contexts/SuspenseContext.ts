import { Element, Ref } from '../types';
import { createContext } from './utils';

export type SuspenseContextType = {
  element: Element;
  fallback: Element;
  suspenseCount: Ref<number>;
  setSuspenseCount: (value: number) => void;
  setRenderResult: (element: Element) => void;
};

export const [SuspenseContext, SuspenseContextProvider] = createContext(
  null as null | SuspenseContextType
);
