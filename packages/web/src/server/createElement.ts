import { createHtmlChunkFromElement } from './utils';
import { isRef } from '@suisei/shared';
import { useOnce } from '@suisei/reactivity';
import { renderer } from './renderer';
import { runWithOwner } from '@suisei/reactivity';
import { SymbolIntrinsicElement, SymbolIs } from '@suisei/shared';
import type { Children, Component, Element, PropBase } from '@suisei/core';
import type { Owner } from '@suisei/reactivity';
import type { ElementsAttributes, ElementsAttributesWithChildren } from '@suisei/htmltypes';

export const createComponentElement = <P extends PropBase>(
	component: Component<P>,
	props: P,
): Element => {
	const elementOwner: Owner = {
		scheduler: renderer.scheduler,
		stateCount: 0,
		onEffectBeforeInitialize() {},
		onEffectSyncInitialize() {},
		onFutureRefetchInitialize() {},
		onFutureRefetchFinish() {},

		onError(error) {

		},

		onStateUpdate(ref) {

		}
	};

	const element = runWithOwner(elementOwner, () => component(props));
	return element;
};

export const createIntrinsicElement = <C extends keyof ElementsAttributes>(
	component: C,
	{ children, ...props }: ElementsAttributesWithChildren<Children, Children<0>>[C],
): Element => {
	const attributes: Record<string, unknown> = {};
	const propNames = Object.keys(props) as (keyof typeof props)[];
	for(let i = 0; i < propNames.length; i++) {
		const propName = propNames[i];
		const propValue = props[propName];
		if (isRef(propValue)) {
			attributes[renderer.config.namespace.templateDataIntrinsicId] = useOnce(propValue);
		} else {
		}
	}

	return {
		[SymbolIs]: SymbolIntrinsicElement,
		name: component,
		attributes: attributes as PropBase,
		children: children,
	};
};
