import type { Ref } from '@suisei/reactivity';
import type { IntrinsicProps, SuiseiElement } from '@suisei/renderer';

export interface SuiseiIntrinsicElements {}

/* eslint-disable @typescript-eslint/no-unused-vars */
export declare namespace JSX {
  interface Element extends SuiseiElement {}
  interface ElementChildrenAttribute {
    children: {};
  }

  interface IntrinsicAttributes extends IntrinsicProps {}
  interface IntrinsicElements extends SuiseiIntrinsicElements {}

  type LibraryManagedAttributes<_TComponent, TProps> = {
    [K in keyof TProps]: TProps[K] extends Ref<infer TValue>
      ? TProps[K] | TValue
      : TProps[K];
  };
}
