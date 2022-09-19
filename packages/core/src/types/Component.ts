import type { Primitives } from '../primitives';
import type { Children, Element } from './Element';
import type { Ref } from '@suisei/reactivity';
import type { PartialByUndefined } from '@suisei/shared';

export type Props<T extends Component> = T extends Component<infer P>
  ? P
  : never;

export type PropsBase = Record<string, Ref | Children>;
export type PropsValidated<T extends PropsBase> = {
  [K in keyof T]: K extends 'children'
    ? T[K] extends Children<infer N>
      ? Children<N>
      : Children
    : T[K] extends Ref
    ? T[K]
    : never;
} & { children: Children };

export type PropsValidatedWithoutChildren<T extends PropsBase> = {
  [K in Exclude<keyof T, 'children'>]: T[K] extends Ref ? T[K] : never;
};

type PropizeImpl<T extends PropsBase> = {
  [K in keyof PropsValidated<T>]: PropsValidated<T>[K] extends Ref<infer T>
    ? T | Ref<T>
    : PropsValidated<T>[K];
} & { key?: string | Ref<string> };

export type Propize<T extends PropsBase> = PartialByUndefined<PropizeImpl<T>>;
export type Depropize<T> = {
  [K in keyof T]: T[K] | Ref<T[K]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component<P extends PropsBase = any> = (
  props: PropsValidated<P>,
  $: Primitives
) => Element | Promise<Element>;
