import { ServerRendererContext } from './contexts/ServerRendererContext';
import { render } from './render';
import { createRenderer } from './renderer';
import type { ServerRendererConfig } from './renderer';
import type { Element } from '@suisei/core';
import type { Writable } from 'stream';

export const renderToStream = (
  stream: Writable,
  element: Element,
  config?: ServerRendererConfig
): Promise<void> | void =>
  render(element, {
    [ServerRendererContext.key]: createRenderer(stream, config),
  });
