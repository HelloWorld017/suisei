import {
  HTMLAudioAttributes,
  HTMLAnchorAttributes,
  HTMLAreaAttributes,
  HTMLAttributes,
  HTMLBaseAttributes,
  HTMLBlockquoteAttributes,
  HTMLButtonAttributes,
  HTMLCanvasAttributes,
  HTMLColAttributes,
  HTMLColgroupAttributes,
  HTMLDataAttributes,
  HTMLDelAttributes,
  HTMLDetailsAttributes,
  HTMLDialogAttributes,
  HTMLEmbedAttributes,
  HTMLFieldsetAttributes,
  HTMLFormAttributes,
  HTMLHtmlAttributes,
  HTMLIframeAttributes,
  HTMLImgAttributes,
  HTMLInputAttributes,
  HTMLInsAttributes,
  HTMLKeygenAttributes,
  HTMLLabelAttributes,
  HTMLLiAttributes,
  HTMLLinkAttributes,
  HTMLMapAttributes,
  HTMLMenuAttributes,
  HTMLMetaAttributes,
  HTMLMeterAttributes,
  HTMLObjectAttributes,
  HTMLOlAttributes,
  HTMLOptgroupAttributes,
  HTMLOptionAttributes,
  HTMLOutputAttributes,
  HTMLParamAttributes,
  HTMLProgressAttributes,
  HTMLQuoteAttributes,
  HTMLSlotAttributes,
  HTMLScriptAttributes,
  HTMLSelectAttributes,
  HTMLSourceAttributes,
  HTMLStyleAttributes,
  HTMLTableAttributes,
  HTMLTdAttributes,
  HTMLTextareaAttributes,
  HTMLThAttributes,
  HTMLTimeAttributes,
  HTMLTrackAttributes,
  HTMLVideoAttributes,
  HTMLWebViewAttributes,
} from './html';

import { SVGAttributes } from './svg';

export interface HTMLElementsAttributes {
  a: HTMLAnchorAttributes<HTMLAnchorElement>;
  abbr: HTMLAttributes<HTMLElement>;
  address: HTMLAttributes<HTMLElement>;
  area: HTMLAreaAttributes<HTMLAreaElement>;
  article: HTMLAttributes<HTMLElement>;
  aside: HTMLAttributes<HTMLElement>;
  audio: HTMLAudioAttributes<HTMLAudioElement>;
  b: HTMLAttributes<HTMLElement>;
  base: HTMLBaseAttributes<HTMLBaseElement>;
  bdi: HTMLAttributes<HTMLElement>;
  bdo: HTMLAttributes<HTMLElement>;
  big: HTMLAttributes<HTMLElement>;
  blockquote: HTMLBlockquoteAttributes<HTMLQuoteElement>;
  body: HTMLAttributes<HTMLBodyElement>;
  br: HTMLAttributes<HTMLBRElement>;
  button: HTMLButtonAttributes<HTMLButtonElement>;
  canvas: HTMLCanvasAttributes<HTMLCanvasElement>;
  caption: HTMLAttributes<HTMLElement>;
  cite: HTMLAttributes<HTMLElement>;
  code: HTMLAttributes<HTMLElement>;
  col: HTMLColAttributes<HTMLTableColElement>;
  colgroup: HTMLColgroupAttributes<HTMLTableColElement>;
  data: HTMLDataAttributes<HTMLDataElement>;
  datalist: HTMLAttributes<HTMLDataListElement>;
  dd: HTMLAttributes<HTMLElement>;
  del: HTMLDelAttributes<HTMLModElement>;
  details: HTMLDetailsAttributes<HTMLDetailsElement>;
  dfn: HTMLAttributes<HTMLElement>;
  dialog: HTMLDialogAttributes<HTMLDialogElement>;
  div: HTMLAttributes<HTMLDivElement>;
  dl: HTMLAttributes<HTMLDListElement>;
  dt: HTMLAttributes<HTMLElement>;
  em: HTMLAttributes<HTMLElement>;
  embed: HTMLEmbedAttributes<HTMLEmbedElement>;
  fieldset: HTMLFieldsetAttributes<HTMLFieldSetElement>;
  figcaption: HTMLAttributes<HTMLElement>;
  figure: HTMLAttributes<HTMLElement>;
  footer: HTMLAttributes<HTMLElement>;
  form: HTMLFormAttributes<HTMLFormElement>;
  h1: HTMLAttributes<HTMLHeadingElement>;
  h2: HTMLAttributes<HTMLHeadingElement>;
  h3: HTMLAttributes<HTMLHeadingElement>;
  h4: HTMLAttributes<HTMLHeadingElement>;
  h5: HTMLAttributes<HTMLHeadingElement>;
  h6: HTMLAttributes<HTMLHeadingElement>;
  head: HTMLAttributes<HTMLElement>;
  header: HTMLAttributes<HTMLElement>;
  hgroup: HTMLAttributes<HTMLElement>;
  hr: HTMLAttributes<HTMLHRElement>;
  html: HTMLHtmlAttributes<HTMLHtmlElement>;
  i: HTMLAttributes<HTMLElement>;
  iframe: HTMLIframeAttributes<HTMLIFrameElement>;
  img: HTMLImgAttributes<HTMLImageElement>;
  input: HTMLInputAttributes<HTMLInputElement>;
  ins: HTMLInsAttributes<HTMLModElement>;
  kbd: HTMLAttributes<HTMLElement>;
  keygen: HTMLKeygenAttributes<HTMLElement>;
  label: HTMLLabelAttributes<HTMLLabelElement>;
  legend: HTMLAttributes<HTMLLegendElement>;
  li: HTMLLiAttributes<HTMLLIElement>;
  link: HTMLLinkAttributes<HTMLLinkElement>;
  main: HTMLAttributes<HTMLElement>;
  map: HTMLMapAttributes<HTMLMapElement>;
  mark: HTMLAttributes<HTMLElement>;
  menu: HTMLMenuAttributes<HTMLMenuElement>;
  menuitem: HTMLAttributes<HTMLElement>;
  meta: HTMLMetaAttributes<HTMLMetaElement>;
  meter: HTMLMeterAttributes<HTMLMeterElement>;
  nav: HTMLAttributes<HTMLElement>;
  noscript: HTMLAttributes<HTMLElement>;
  object: HTMLObjectAttributes<HTMLObjectElement>;
  ol: HTMLOlAttributes<HTMLOListElement>;
  optgroup: HTMLOptgroupAttributes<HTMLOptGroupElement>;
  option: HTMLOptionAttributes<HTMLOptionElement>;
  output: HTMLOutputAttributes<HTMLOutputElement>;
  p: HTMLAttributes<HTMLParagraphElement>;
  param: HTMLParamAttributes<HTMLParamElement>;
  picture: HTMLAttributes<HTMLElement>;
  pre: HTMLAttributes<HTMLPreElement>;
  progress: HTMLProgressAttributes<HTMLProgressElement>;
  q: HTMLQuoteAttributes<HTMLQuoteElement>;
  rp: HTMLAttributes<HTMLElement>;
  rt: HTMLAttributes<HTMLElement>;
  ruby: HTMLAttributes<HTMLElement>;
  s: HTMLAttributes<HTMLElement>;
  samp: HTMLAttributes<HTMLElement>;
  slot: HTMLSlotAttributes<HTMLSlotElement>;
  script: HTMLScriptAttributes<HTMLScriptElement>;
  section: HTMLAttributes<HTMLElement>;
  select: HTMLSelectAttributes<HTMLSelectElement>;
  small: HTMLAttributes<HTMLElement>;
  source: HTMLSourceAttributes<HTMLSourceElement>;
  span: HTMLAttributes<HTMLSpanElement>;
  strong: HTMLAttributes<HTMLElement>;
  style: HTMLStyleAttributes<HTMLStyleElement>;
  sub: HTMLAttributes<HTMLElement>;
  summary: HTMLAttributes<HTMLElement>;
  sup: HTMLAttributes<HTMLElement>;
  table: HTMLTableAttributes<HTMLTableElement>;
  template: HTMLAttributes<HTMLTemplateElement>;
  tbody: HTMLAttributes<HTMLTableSectionElement>;
  td: HTMLTdAttributes<HTMLTableDataCellElement>;
  textarea: HTMLTextareaAttributes<HTMLTextAreaElement>;
  tfoot: HTMLAttributes<HTMLTableSectionElement>;
  th: HTMLThAttributes<HTMLTableHeaderCellElement>;
  thead: HTMLAttributes<HTMLTableSectionElement>;
  time: HTMLTimeAttributes<HTMLTimeElement>;
  title: HTMLAttributes<HTMLTitleElement>;
  tr: HTMLAttributes<HTMLTableRowElement>;
  track: HTMLTrackAttributes<HTMLTrackElement>;
  u: HTMLAttributes<HTMLElement>;
  ul: HTMLAttributes<HTMLUListElement>;
  var: HTMLAttributes<HTMLElement>;
  video: HTMLVideoAttributes<HTMLVideoElement>;
  wbr: HTMLAttributes<HTMLElement>;
  webview: HTMLWebViewAttributes<HTMLWebViewElement>;
}

export interface SVGElementsAttributes {
  animate: SVGAttributes<SVGAnimateElement>;
  circle: SVGAttributes<SVGCircleElement>;
  clipPath: SVGAttributes<SVGClipPathElement>;
  defs: SVGAttributes<SVGDefsElement>;
  desc: SVGAttributes<SVGDescElement>;
  ellipse: SVGAttributes<SVGEllipseElement>;
  feBlend: SVGAttributes<SVGFEBlendElement>;
  feColorMatrix: SVGAttributes<SVGFEColorMatrixElement>;
  feComponentTransfer: SVGAttributes<SVGFEComponentTransferElement>;
  feComposite: SVGAttributes<SVGFECompositeElement>;
  feConvolveMatrix: SVGAttributes<SVGFEConvolveMatrixElement>;
  feDiffuseLighting: SVGAttributes<SVGFEDiffuseLightingElement>;
  feDisplacementMap: SVGAttributes<SVGFEDisplacementMapElement>;
  feDistantLight: SVGAttributes<SVGFEDistantLightElement>;
  feDropShadow: SVGAttributes<SVGFEDropShadowElement>;
  feFlood: SVGAttributes<SVGFEFloodElement>;
  feFuncA: SVGAttributes<SVGFEFuncAElement>;
  feFuncB: SVGAttributes<SVGFEFuncBElement>;
  feFuncG: SVGAttributes<SVGFEFuncGElement>;
  feFuncR: SVGAttributes<SVGFEFuncRElement>;
  feGaussianBlur: SVGAttributes<SVGFEGaussianBlurElement>;
  feImage: SVGAttributes<SVGFEImageElement>;
  feMerge: SVGAttributes<SVGFEMergeElement>;
  feMergeNode: SVGAttributes<SVGFEMergeNodeElement>;
  feMorphology: SVGAttributes<SVGFEMorphologyElement>;
  feOffset: SVGAttributes<SVGFEOffsetElement>;
  fePointLight: SVGAttributes<SVGFEPointLightElement>;
  feSpecularLighting: SVGAttributes<SVGFESpecularLightingElement>;
  feSpotLight: SVGAttributes<SVGFESpotLightElement>;
  feTile: SVGAttributes<SVGFETileElement>;
  feTurbulence: SVGAttributes<SVGFETurbulenceElement>;
  filter: SVGAttributes<SVGFilterElement>;
  foreignObject: SVGAttributes<SVGForeignObjectElement>;
  g: SVGAttributes<SVGGElement>;
  image: SVGAttributes<SVGImageElement>;
  line: SVGAttributes<SVGLineElement>;
  linearGradient: SVGAttributes<SVGLinearGradientElement>;
  marker: SVGAttributes<SVGMarkerElement>;
  mask: SVGAttributes<SVGMaskElement>;
  metadata: SVGAttributes<SVGMetadataElement>;
  path: SVGAttributes<SVGPathElement>;
  pattern: SVGAttributes<SVGPatternElement>;
  polygon: SVGAttributes<SVGPolygonElement>;
  polyline: SVGAttributes<SVGPolylineElement>;
  radialGradient: SVGAttributes<SVGRadialGradientElement>;
  rect: SVGAttributes<SVGRectElement>;
  stop: SVGAttributes<SVGStopElement>;
  svg: SVGAttributes<SVGSVGElement>;
  switch: SVGAttributes<SVGSwitchElement>;
  symbol: SVGAttributes<SVGSymbolElement>;
  text: SVGAttributes<SVGTextElement>;
  textPath: SVGAttributes<SVGTextPathElement>;
  tspan: SVGAttributes<SVGTSpanElement>;
  use: SVGAttributes<SVGUseElement>;
  view: SVGAttributes<SVGViewElement>;
}

export type ElementsAttributes = HTMLElementsAttributes & SVGElementsAttributes;

export type VoidElementsNames =
  | 'area'
  | 'base'
  | 'br'
  | 'col'
  | 'embed'
  | 'hr'
  | 'img'
  | 'input'
  | 'link'
  | 'meta'
  | 'param'
  | 'source'
  | 'track'
  | 'wbr';

export type VoidElementsAttributes = Pick<
  ElementsAttributes,
  VoidElementsNames
>;
export type ElementsAttributesWithChildren<
  ChildrenType,
  VoidChildrenType = []
> = {
  [K in keyof ElementsAttributes]: K extends VoidElementsNames
    ? ElementsAttributes[K] & { children: VoidChildrenType }
    : ElementsAttributes[K] & { children: ChildrenType };
};

export * from './aria';
export * from './css';
export * from './dom';
export * from './html';
export * from './svg';
