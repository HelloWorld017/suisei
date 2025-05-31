export type DependencyWriteKey = number & { __kind?: 'DependencyWriteKey' };
export type DependencyMap<TParent extends object, TChild extends object> = {
  add(parent: TParent, child: TChild, writeKey: DependencyWriteKey): void;
  writeForChild(child: TChild): DependencyWriteKey;
  forEachChild(parent: TParent, callback: (key: TChild) => void): void;
};

export type OverlayDependencyMap<
  TParent extends object,
  TChild extends object,
> = DependencyMap<TParent, TChild> & {
  commit(): void;
};
