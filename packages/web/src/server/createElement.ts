import { createHtmlChunkFromElement } from './utils';
import { isRef } from '@suisei/shared';
import { useOnce } from '@suisei/reactivity';
import { renderer } from './renderer';
import { runWithOwner } from '@suisei/reactivity';
import { SymbolIntrinsicElement, SymbolIs } from '@suisei/shared';
import type { Component, Element } from '@suisei/core';
import type { Effect, Owner, Ref } from '@suisei/reactivity';
import type { ElementsAttributes, VoidElementsAttributes } from '@suisei/htmltypes';

type ChildrenType<P extends Record<string, any>> =
	Pick<P, 'children'> extends { children: Array<Element> }
		? Pick<P, 'children'>['children']
		: Pick<P, 'children'> extends { children: Element }
			? [ Element ]
			: [];

type PropsType<P extends Record<string, any>> =
	{ [ K in keyof P ]: P[K] extends Ref<infer T> ? (T | Ref<T>) : (P[K] | Ref<P[K]>) };

export const createComponentElement = <P extends Record<string, any>>(
	component: Component<P>,
	props: PropsType<Omit<P, 'children'>>,
	...children: ChildrenType<P>
): Element => {
	const effects: Effect[] = [];
	const elementOwner: Owner = {
		scheduler: renderer.scheduler,
		stateCount: 0,
		onEffectBeforeInitialize(effect) {
			effects.push(effect);
		},

		onEffectSyncInitialize() {},

		onError(error) {

		},

		onStateUpdate(ref) {

		}
	};

	const element = runWithOwner(elementOwner, () => component(
		{ ...props, children } as (P & { children: ChildrenType<P> })
	));

	return element;
};

export const createIntrinsicElement = <C extends keyof ElementsAttributes>(
	component: C,
	props: PropsType<ElementsAttributes[C]>,
	...children: C extends keyof VoidElementsAttributes ? Array<Element> : []
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
		attributes: attributes as Record<string, unknown>,
		children,
	};
};
