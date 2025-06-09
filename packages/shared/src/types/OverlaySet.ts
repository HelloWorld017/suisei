export type OverlaySet<T> = {
  add(value: T): OverlaySet<T>;
  has(value: T): boolean;
  delete(value: T): boolean;
  commit(): void;
  forEach(callback: (value: T) => void): void;
};
