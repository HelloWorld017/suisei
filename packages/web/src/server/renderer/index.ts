import { ServerRenderer } from "../types/ServerRenderer";

export let renderer: ServerRenderer;

export const runWithRenderer = (fn: () => void) => {
	renderer = {
		emit: ()
	}
};
