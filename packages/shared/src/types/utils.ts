export type Equals<X, Y> =
	[X] extends [Y] ? ([Y] extends [X] ? true : false) : false;

type PickUndefined<T> = {
	[K in keyof T]-?: undefined extends T[K] ? K : never
}[keyof T]

export type PartialByUndefined<T> =
	& Partial<Pick<T, PickUndefined<T>>>
	& Pick<T, Exclude<keyof T, PickUndefined<T>>>
