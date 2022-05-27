import { createElement } from '@suisei/core';
import { renderer } from '../renderer';
import { Fragment } from '@suisei/core';
import { SymbolIntrinsicElement } from '@suisei/shared';
import type { Component } from '@suisei/core';

export const hybrid = <P extends Record<string, any>>
	(component: Component<P>): Component<P> =>
	({ children, ...props }: P) => {
		const element = createElement(component, props);
		
		const componentId = renderer.componentMap.get(component)!;
		const registeredComponentId = componentId || renderer.registerComponent(component);
		
		const scriptElement = {
			is: SymbolIntrinsicElement,
			name: 'script',
			attributes: {},
			children: [ `${renderer.config.namespace.hybridRender}("${registeredComponentId}", )` ]
		};
		
		if (!registeredComponentId) {
			return createElement(Fragment, {}, [ {
				is: SymbolIntrinsicElement,
				name: 'template',
				attributes: { [renderer.config.namespace.templateDataComponentId]: componentId },
				children: [ element ]
			}, scriptElement ]);
		}
		
		return scriptElement;
	};
