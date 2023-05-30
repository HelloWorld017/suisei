import { Ref } from 'suisei';
import {
  ContextRegistry,
  FragmentProps,
  Propize,
} from 'suisei/unsafe-internals';
import { ClientRenderer } from '../types';

export const renderFragmentElement = async (
  renderer: ClientRenderer,
  contextRegistry: ContextRegistry,
  props: Propize<FragmentProps>,
  provide: Record<symbol, Ref<unknown>> | null
) => {
  const { raw, children } = props;
};
