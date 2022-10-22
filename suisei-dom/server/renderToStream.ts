import { render } from './render';
import { createRenderer } from './renderer';
import type { ServerRendererConfig } from './renderer';
import type { Writable } from 'node:stream';
import type { SuiseiElement as Element } from 'suisei';

export const renderToStream = (
  stream: Writable,
  element: Element,
  config?: ServerRendererConfig
): Promise<void> | void => render(createRenderer(stream, config), element);
