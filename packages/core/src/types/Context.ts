import { Children, Element } from './Element';

export type Context<T> = { name?: string, defaultValue: T };
export type Provider<T> = (props: { value: T, children: Children }) => Element;
