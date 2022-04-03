import { runWithRenderer } from './renderer';
import { Element } from '@suisei/core';

export const renderToStream = (stream: ReadableStream, render: (h: (element: Element) => void) => void) => {
	runWithRenderer(() => render(rootElement => {
		
	}));
};
