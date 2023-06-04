import { createContext } from './utils';

export type SuspenseContextType = {
  alternate: () => void;
};

export const [SuspenseContext, SuspenseContextProvider] = createContext(
  null as null | SuspenseContextType
);
