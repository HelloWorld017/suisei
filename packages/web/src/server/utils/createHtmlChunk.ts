import LRU from 'lru-cache';
import type { CSSProperties, ElementsAttributes } from '@suisei/htmltypes';

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

const IS_NON_DIMENSIONAL =
	/^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini)/;

const hypenateCache = new LRU({
	max: 5000,
	maxSize: 100000,
	sizeCalculation: (value: string) => value.length
});

const hypenateCssName = (name: string): string => {
	const cachedHypenatedName = hypenateCache.get(name);
	if (typeof cachedHypenatedName === 'string')
		return cachedHypenatedName;
	
	const hypenatedName = name.replace(/[A-Z]/g, (match: string) => `-${match.toLowerCase()}`);
	cachedHypenatedName.set(name, hypenatedName);
	
	return hypenatedName;
};

export const createCssProperty = (cssObject: CSSProperties): string | undefined => {
	let s = '';
	const cssNames = Object.keys(cssObject) as (keyof CSSProperties)[];
	for (let i = 0; i < cssNames.length; i++) {
		const cssName = cssNames[i];
		const cssValue = cssObject[cssName];
		
		s += `${hypenateCssName(cssName)}:${cssValue}`;
		if (typeof cssValue === 'number' && IS_NON_DIMENSIONAL.test(cssName)) {
			s += 'px';
		}
		s += ';';
	}
	
	return s || undefined;
};

const VOID_ELEMENTS =
	/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/;

const UNSAFE_NAME = /[\s\n\\/='"\0<>]/;
const BOOLEAN_LITERAL_NAME = /^data-|^aria-/;

export const createHtmlChunk = <T extends keyof ElementsAttributes>
	(tagName: T, props: ElementsAttributes[T], children: string, isInSVG = false): string =>
{
	let s = '<' + tagName;
	const propNames = Object.keys(props);
	
	for (let i = 0; i < propNames.length; i++) {
		let propName = propNames[i];
		const rawPropValue = props[propName as keyof ElementsAttributes[T]];
		
		let propValue: string | number | boolean | undefined;
		if (propName === 'htmlFor') {
			if ('for' in props)
				continue;
			
			propName = 'for';
		}
		
		if (isInSVG && propName.startsWith('xlink'))
			propName = propName.slice(5);

		if (propName === 'style' && rawPropValue)
			propValue = createCssProperty(rawPropValue as CSSProperties);
		
		if (typeof rawPropValue === 'boolean') {
			if (BOOLEAN_LITERAL_NAME.test(propName)) {
				propValue = String(rawPropValue);
			} else {
				propValue = rawPropValue;
			}
		} else if (typeof rawPropValue === 'number' || typeof rawPropValue === 'string') {
			propValue = rawPropValue;
		}
		
		if (UNSAFE_NAME.test(propName))
			continue;
		
		if (typeof propValue === 'undefined' || propValue === false)
			continue;
		
		if (propValue === true) {
			s += ` ${propName}`;
			continue;
		}
		
		s += ` ${propName}="${encodeEntities(propValue)}"`;
	}
	s += '>';
	
	if (VOID_ELEMENTS.test(tagName)) {
		return s;
	}
	
	s += children;
	s += `</${tagName}>`;
	
	return s;
};
