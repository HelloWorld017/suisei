import { createContext } from '@suisei/core';
import { ServerRenderer } from '../types';

export const [ ServerRendererContext ] =
	createContext<ServerRenderer>(null as unknown as ServerRenderer);
