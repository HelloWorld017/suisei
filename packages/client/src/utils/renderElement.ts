import type { ClientRenderer } from '../types/ClientRenderer';
import type { SuiseiElement, SuiseiElementInternal } from '@suisei/renderer';

export const renderIntrinsicElement = <TNode>(
  renderer: ClientRenderer<TNode>,
  element: SuiseiElement
) => {
  const internalElement = element as SuiseiElementInternal;
};
