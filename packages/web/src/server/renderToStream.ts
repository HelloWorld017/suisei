import { runWithRenderer } from './renderer';
import type { Element } from '@suisei/core';
import type { ServerRendererConfig } from './renderer';

export const renderToStream = (
	stream: ReadableStream,
	render: (h: (element: Element) => void) => void,
	config?: ServerRendererConfig
) => {
	runWithRenderer(stream, () => render(rootElement => {
		
	}), config);
};
