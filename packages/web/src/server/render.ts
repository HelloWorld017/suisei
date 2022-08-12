import { assertsIsElement, isElement, isPromise, isRef } from '@suisei/shared';
import { createHtmlChunkFromElement } from './utils';
import { createPrimitives, PropsValidated, readContext, wrapProps } from '@suisei/core';
import { renderer } from './renderer';
import { ErrorBoundaryContext, SuspenseContext } from '@suisei/core';
import { ServerRendererContext } from './contexts/ServerRendererContext';
import { SymbolIs } from '@suisei/shared';
import type { Children, Component, ContextRegistry, Element, Propize, PropsBase } from '@suisei/core';
import type { ElementsAttributes, ElementsAttributesWithChildren } from '@suisei/htmltypes';
import type { Owner } from '@suisei/reactivity';
import type { ServerRenderer } from './types';

const getRendererFromRegistry = (contextRegistry: ContextRegistry): ServerRenderer =>
	readContext(contextRegistry, ServerRendererContext);

const createOwner = (renderer: ServerRenderer, contextRegistry: ContextRegistry): Owner => ({
	scheduler: renderer.scheduler,
	stateCount: 0,
	onEffectInitialize() {},
	onEffectSyncInitialize() {},
	onFutureRefetchInitialize() {},
	onFutureRefetchFinish() {},
	onError(error) {
		const errorBoundary = readContext(contextRegistry, ErrorBoundaryContext);
		if (errorBoundary) {
			errorBoundary(error);
			return;
		}

		throw error;
	},
	onStateUpdate(_ref) {}
});

const renderFragmentElement = (
	contextRegistry: ContextRegistry,
	_props: Record<string, unknown>,
	provide: Record<symbol, unknown> | null,
	children: Children
) => {
	const renderer = getRendererFromRegistry(contextRegistry);
	const owner = createOwner(renderer, contextRegistry);
	const $ = createPrimitives(contextRegistry, owner);

	children
		.flatMap(child => {
			if (isRef(child)) {
				return $.useOnce(child);
			}

			return child;
		})
		.forEach(child => {
			if (isElement(child)) {
				if (provide) {
					if (SuspenseContext.key in provide) {
						
					}
					
					render(child, { contextRegistry, ...provide });
					return;
				}

				render(child);
				return;
			}

			if (child === null) {
				return;
			}

			renderer.emit(String(child));
		});
};

export const renderComponentElement = <P extends PropsBase>(
	contextRegistry: ContextRegistry,
	component: Component<P>,
	props: Propize<P>,
	children: PropsValidated<P>['children']
) => {
	const renderer = getRendererFromRegistry(contextRegistry);
	const owner = createOwner(renderer, contextRegistry);
	const $ = createPrimitives(contextRegistry, owner);

	const propsWrapped = wrapProps(props, $) as PropsValidated<P>;
	propsWrapped.children = children;

	const result = component(propsWrapped, $);
	if(!isPromise(result)) {
		render(result, contextRegistry);
		return;
	}

	const suspense = $.consume(SuspenseContext);
	if (suspense) {
		renderer.cork();
		suspense.registerSuspensedElement(result);
		result.then((element) => {
			renderer.uncork(() => render(element, contextRegistry));
		});
	}
};

export const renderIntrinsicElement = <C extends keyof ElementsAttributes>(
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
		attributes: attributes as PropsBase,
		children: children,
	};
};

export const render = (element: Element, contextRegistry: ContextRegistry = {}) => {
	assertsIsElement(element);
}
