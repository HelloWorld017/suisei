export type SimplifyDeep<T> = {
  [K in keyof T]: T[K] extends object ? SimplifyDeep<T[K]> : T[K];
};

export type Simplify<T> = {
  [K in keyof T]: T[K];
};
