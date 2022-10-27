import { createFragmentElement } from '../../createElement';
import { globalPrimitives } from '../../primitives';
import type {
  Children,
  Context,
  ContextProvider,
  WrapProps,
} from '../../types';

type ContextProviderProps<T> = WrapProps<{ value: T; children: Children }>;
export const createContext = <T>(
  defaultValue: T,
  name?: string
): [Context<T>, ContextProvider<T>] => {
  const GeneratedContext = {
    key: Symbol(),
    name,
    defaultValue: globalPrimitives.constant(defaultValue),
  } as Context<T>;

  const GeneratedContextProvider: ContextProvider<T> = ({
    value,
    children,
  }: ContextProviderProps<T>) =>
    createFragmentElement(
      { [GeneratedContext.key]: value },
      { children, raw: false }
    );

  return [GeneratedContext, GeneratedContextProvider];
};
