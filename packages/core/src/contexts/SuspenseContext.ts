import { createContext } from "./utils";

export type SuspenseContextType = { }

export const [ SuspenseContext, SuspenseContextProvider ] =
	createContext(null as null | SuspenseContextType);
