export type DependencyWriteKey = symbol & { __kind?: 'DependencyWriteKey' };
export type DependencyMap<TDependency, TEffect, TPipeline extends number> = {
  add(
    parent: TDependency,
    child: TDependency | TEffect,
    pipeline?: TPipeline | null,
    writeKey?: DependencyWriteKey
  ): void;
  rewrite(child: TDependency | TEffect): DependencyWriteKey;
  traverse(
    parent: TDependency,
    callback: (child: TDependency | TEffect, pipeline: TPipeline | null) => void
  ): void;
  dispose(node: TDependency | TEffect): void;
  isActive(parent: TDependency): boolean;
};

export type OverlayDependencyMap<
  TDependency,
  TEffect,
  TPipeline extends number,
> = DependencyMap<TDependency, TEffect, TPipeline> & {
  commit(): void;
};

export type DependencyMapInternal<
  TDependency extends object,
  TEffect extends object,
  TPipeline extends number,
> = DependencyMap<TDependency, TEffect, TPipeline> & {
  _parentMap: WeakMap<TDependency | TEffect, Set<TDependency>>;
  _childrenMap: WeakMap<
    TDependency,
    Map<TDependency | TEffect, TPipeline | null>
  >;
  _writeKeyMap: WeakMap<TDependency | TEffect, DependencyWriteKey>;
};
