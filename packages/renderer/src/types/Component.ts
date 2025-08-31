import type { Continuation } from './Continuation';
import type { SuiseiNode } from './Element';
import type {
  ReadwriteRef,
  Ref,
  UnwrapFuture,
  Variable,
} from '@suisei/reactivity';
import type { Simplify } from '@suisei/shared';

export type Props<T extends Component> =
  T extends Component<infer P> ? P : never;

export type UnknownProps = Record<string, Ref | undefined>;

export type IntrinsicProps = {
  's:key'?: string;
  's:cache'?: string;
};

export type WrapProps<T extends object> = Simplify<
  {
    [TKey in keyof T as TKey extends `$${string}`
      ? never
      : TKey]: T[TKey] extends Variable<infer TValue>
      ? Variable<UnwrapFuture<TValue>>
      : Variable<UnwrapFuture<T[TKey]>>;
  } & {
    [TKey in keyof T as TKey extends `$${string}`
      ? TKey
      : never]: T[TKey] extends Ref<infer TValue>
      ? ReadwriteRef<TValue>
      : ReadwriteRef<T[TKey]>;
  }
>;

export type Component<TProps extends UnknownProps = UnknownProps> = {
  (props: TProps): SuiseiNode | Generator<Continuation, SuiseiNode, void>;
  displayName?: string;
};
