export type Equals<X, Y> =
	[X] extends [Y] ? ([Y] extends [X] ? true : false) : false;
