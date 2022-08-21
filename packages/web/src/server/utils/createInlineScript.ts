import { encodeEntities, safeJSONStringify } from '../../shared';

export const createInlineScript = (body: string, nonce?: string): string => {
	let s = '<script';
	if (typeof nonce === 'string') {
		s += ` nonce="${encodeEntities(nonce)}"`;
	}
	
	s += `>${body}</script>`;
	
	return s;
};

export const createSuspenseInitInlineScript = (namespace: string, nonce?: string) => {
	return createInlineScript(
		`window.${namespace}=Object.assign(` +
			'window${namespace}||{},' +
			'{' +
				's(i,r){' +
					'let t=document.getElementById(i);' +
					'if(!t)return;'+
					'let e=t.nextSibling;'+
					'let k="/"+i;' +
					'while(e){' +
						'if(e.nodeType===Node.COMMENT_NODE&&e.data===k)break;' +
						'e.remove();' +
						'e=e.nextSibling' +
					'}' +
					'e.parentElement.insertBefore(e,r)' +
				'}' +
			'}' +
		')',
		nonce
	);
};

export const createSuspenseInlineScript = (
	namespace: string,
	suspenseId: string,
	replacement: string,
	nonce?: string
) => {
	return createInlineScript(
		`${namespace}.s(` +
			`${safeJSONStringify(suspenseId)},` +
			`${safeJSONStringify(replacement)}` +
		')',
		nonce
	);
}
