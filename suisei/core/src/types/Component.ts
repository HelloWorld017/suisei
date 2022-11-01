import type { Primitives } from '../primitives';
import type { Children, Element } from './Element';
import type { Ref } from '@suisei/reactivity';

export type Props<T extends Component> = T extends Component<infer P>
  ? P
  : never;

export type PropsBase = Record<string, Ref | undefined>;
export type PropsWithKey<P extends PropsBase> = P & {
  key?: Ref<string | undefined>;
};

// Propize: { K: Ref<T> } -> { K: T | Ref<T> }
export type Propize<P extends PropsBase> = {
  [K in keyof P]: P[K] extends Ref<infer T> ? T | Ref<T> : P[K];
};

// Depropize: { K: T } -> { K: T | Ref<T> }
export type Depropize<T> = {
  [K in keyof T]: T[K] | Ref<T[K]>;
};

// WrapProps: { K: T | Ref<T> } -> { K: Ref<T> }
export type WrapProps<T extends object> = {
  [K in keyof T]: T[K] extends Ref<infer V> ? Ref<V> : Ref<T[K]>;
};

// UnwrapProps: { K: T | Ref<T> } -> { K: T }
export type UnwrapProps<T extends object> = {
  [K in keyof T]: T[K] extends Ref<infer V> ? V : T[K];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component<P extends PropsBase = any> = (
  props: P,
  $: Primitives
) => Element | Promise<Element>;

export type FragmentProps = WrapProps<{
  raw: boolean;
  children?: Children;
}>;
