import type { ElementsAttributes } from '@suisei/htmltypes';
import {
	createAttribute,
	createClassNameAttribute,
	createStyleAttribute,
	standardizeAttributeName
} from '../../shared';

const ENCODED_ENTITIES = /[&<>"]/;
export const encodeEntities = (input: string | number | boolean) => {
	const s = String(input);

	if (!ENCODED_ENTITIES.test(s))
		return s;
	
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};


const VOID_ELEMENTS =
	/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/;

const UNSAFE_NAME = /[\s\n\\/='"\0<>]/;

type AttributeHandler = (value: unknown) => string;
const attributeHandlers = new Map<string, AttributeHandler>();
attributeHandlers.set('className', createClassNameAttribute as AttributeHandler);
attributeHandlers.set('style', createStyleAttribute as AttributeHandler);


export const createHtmlOpenChunk = <T extends keyof ElementsAttributes>
	(tagName: T, props: ElementsAttributes[T]): string =>
{
	let s = '<' + tagName;
	const propNames = Object.keys(props);

	for (let i = 0; i < propNames.length; i++) {
		const rawPropName = propNames[i] as keyof ElementsAttributes[keyof ElementsAttributes];
		const rawPropValue = props[rawPropName];

		const propName = standardizeAttributeName(rawPropName);
		if (UNSAFE_NAME.test(propName))
			continue;

		let propValue: string | true | undefined;
		const handler = attributeHandlers.get(rawPropName);
		if (handler) {
			propValue = handler(rawPropValue);
		} else {
			propValue = createAttribute(rawPropName, rawPropValue);
		}

		if (typeof propValue === 'undefined')
			continue;

		if (propValue === true) {
			s += ` ${propName}`;
			continue;
		}

		s += ` ${propName}="${encodeEntities(propValue)}"`;
	}

	s += '>';

	return s;
};

export const createHtmlChunk = <T extends keyof ElementsAttributes>
	(tagName: T, props: ElementsAttributes[T], children: string): string =>
{
	let s = createHtmlOpenChunk(tagName, props);

	if (VOID_ELEMENTS.test(tagName)) {
		return s;
	}

	s += children;
	s += `</${tagName}>`;

	return s;
};
