import * as CSS from 'csstype';

export type CSSProperties = {
	[K in keyof CSS.Properties<string | number> as K extends `ms${infer T}` ? `Ms${T}` : K]:
		CSS.Properties<string | number>[K]
};

export type ClassName =
	| string
	| { [ K in string ]: boolean };

export type CSSAttributes = {
	className?: ClassName | ClassName[];
	style?: CSSProperties;
};
