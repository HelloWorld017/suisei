export type Simplify<T> = {
  [K in keyof T]: T[K] extends object ? Simplify<T[K]> : T[K];
};
