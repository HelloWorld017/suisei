import { SymbolElement } from "@suisei/shared";

export type Element = {
	is: typeof SymbolElement,
	name: string,
	attributes: Record<string, unknown>,
};
