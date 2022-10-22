import { createFragmentElement } from '../../createElement';
import { globalPrimitives } from '../../primitives';
import type { Children, Context, Provider, WrapProps } from '../../types';

type ContextProviderProps<T> = WrapProps<{ value: T; children: Children }>;
export const createContext = <T>(
  defaultValue: T,
  name?: string
): [Context<T>, Provider<T>] => {
  const GeneratedContext = {
    key: Symbol(),
    name,
    defaultValue: globalPrimitives.constant(defaultValue),
  } as Context<T>;

  const GeneratedContextProvider: Provider<T> = ({
    value,
    children,
  }: ContextProviderProps<T>) =>
    createFragmentElement(
      { [GeneratedContext.key]: value },
      { children, raw: false }
    );

  return [GeneratedContext, GeneratedContextProvider];
};
