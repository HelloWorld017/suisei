import type { ServerRendererConfig } from './renderer';
import type { Element } from '@suisei/core';

export const renderToStream = (
  stream: ReadableStream,
  render: (h: (element: Element) => void) => void,
  config?: ServerRendererConfig
) => {
  runWithRenderer(stream, () => render(rootElement => {}), config);
};
