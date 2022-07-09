import { createElement } from '../createElement';
import { Fragment } from '../components';
import type { Element, Node } from '../types';

export const publish = <T>(defaultValue?: T): (props: { children: Node }) => Element => {
	return ({ children }) => createElement(Fragment, children);
}
