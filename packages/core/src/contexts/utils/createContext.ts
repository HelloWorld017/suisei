import { createFragmentElement } from '../../createElement';
import type { Children, Context, Provider } from '../../types';

type ContextProviderProps<T> = { value: T; children: Children };
export const createContext = <T>(
  defaultValue: T,
  name?: string
): [Context<T>, Provider<T>] => {
  const GeneratedContext = { key: Symbol(), name, defaultValue } as Context<T>;
  const GeneratedContextProvider: Provider<T> = ({
    value,
    children,
  }: ContextProviderProps<T>) =>
    createFragmentElement({ [GeneratedContext.key]: value }, { children });

  return [GeneratedContext, GeneratedContextProvider];
};
