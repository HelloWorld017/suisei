import type { ClientRendererDefinition } from './ClientRendererDefinition';

export type ClientRenderer<TNode> = {
  definition: ClientRendererDefinition<TNode>;
};
