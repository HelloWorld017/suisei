import { Children, Element } from './Element';

export type Context<T> = { readonly key: unique symbol, name?: string, defaultValue: T };
export type ContextRegistry = Record<symbol, unknown>;
export type Provider<T> = (props: { value: T, children: Children }) => Element;
