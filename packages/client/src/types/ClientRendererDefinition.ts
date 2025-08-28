import type { BoundaryKind } from '@suisei/renderer';

type ClientRendererHydrateDefinition<TNode> =
  | { canHydrate: false }
  | {
      canHydrate: true;
      getFirstChildren(node: TNode): TNode | null;
      getNextSibling(node: TNode): TNode | null;
      getBoundaryKind(node: TNode): BoundaryKind | null;
    };

export type ClientRendererDefinition<TNode> = {
  createIntrinsicNode(
    kind: string,
    attributes: Record<string, unknown>,
    children: TNode[]
  ): TNode;
  createTextNode(text: string): TNode;
  updateText(node: TNode, text: string): void;
  updateAttribute(node: TNode, name: string, value: unknown): void;
  removeNode(node: TNode): void;
  reorderNode(node: TNode, before: TNode | null): void;
  insertNode(node: TNode, parent: TNode): void;
} & ClientRendererHydrateDefinition<TNode>;
