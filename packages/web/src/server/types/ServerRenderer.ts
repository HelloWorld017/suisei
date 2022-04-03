import { Component } from '@suisei/core';

export type ServerRenderer = {
	nextElementId(): string;
	emit(chunk: string): void;
	componentMap: WeakMap<Component<any>, string>;
};
