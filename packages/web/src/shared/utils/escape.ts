const ENCODED_ENTITIES = /[&<>"]/;
export const encodeEntities = (input: string | number | boolean): string => {
	const s = String(input);

	if (!ENCODED_ENTITIES.test(s))
		return s;
	
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};

// < should be \x3c but it seems that node.js automatically does that.
// WARN this behavior is not specified in the ECMA specification!
// FIXME add proper escape of JSON.stringify result
export const safeJSONStringify = JSON.stringify;


const UNSAFE_NAME = /[\s\n\\/='"\0<>]/;
export const isUnsafeAttributeName = (attributeName: string): boolean =>
	UNSAFE_NAME.test(attributeName);
