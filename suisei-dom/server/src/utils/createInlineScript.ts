import { safeJSONStringify } from '@suisei-dom/shared';

export const createSuspenseInitInlineScript = (namespace: string) =>
  //prettier-ignore
  `window.${namespace}=Object.assign(` +
      'window${namespace}||{},' +
      '{' +
        's(i,r){' +
          'let t=document.getElementById(i);' +
          'if(!t)return;' +

          'let e=t.nextSibling;' +
          'let k="/"+i;' +

          'while(e){' +
            'if(e.nodeType===Node.COMMENT_NODE&&e.data===k)break;' +
              'e.remove();' +
              'e=e.nextSibling' +
            '}' +
            'e.parentElement.insertBefore(e,r)' +
          '}' +
        '}' +
      '}' +
    ')';

export const createSuspenseInlineScript = (
  namespace: string,
  suspenseId: string,
  replacement: string
) =>
  //prettier-ignore
  `${namespace}.s(` +
    `${safeJSONStringify(suspenseId)},` +
    `${safeJSONStringify(replacement)}` +
  ')';
