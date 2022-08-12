import { createContext } from './utils';

export type SuspenseContextType = {
	registerSuspensedElement: (promise: Promise<unknown>) => void
};

export const [ SuspenseContext, SuspenseContextProvider ] =
	createContext(null as null | SuspenseContextType);
