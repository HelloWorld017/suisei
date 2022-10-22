import type { ElementsAttributesWithChildren } from '@suisei-dom/htmltypes';
import type { Children } from 'suisei';

export type SuiseiElementsAttributes = ElementsAttributesWithChildren<
  Children,
  Children<0>
>;
