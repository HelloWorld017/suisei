import { createProviderElement } from '../../createElement';
import type { Children, Context, Provider } from '../../types';

export const createContext = <T>(
  defaultValue: T,
  name?: string
): [Context<T>, Provider<T>] => {
  const GeneratedContext = { key: Symbol(), name, defaultValue } as Context<T>;
  const GeneratedContextProvider: Provider<T> = ({
    key,
    value,
    children,
  }: {
    key?: string;
    value: T;
    children: Children;
  }) => createProviderElement(value, { key }, children);

  return [GeneratedContext, GeneratedContextProvider];
};
