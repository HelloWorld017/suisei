export type OverlayMap<K, V> = {
  get(key: K): V | undefined;
  set(key: K, value: V): OverlayMap<K, V>;
  has(key: K): boolean;
  delete(key: K): boolean;
  commit(): void;
};
