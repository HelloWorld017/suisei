import type { AriaAttributes } from './aria';
import type { CSSAttributes } from './css';
import type { DOMEventAttributes } from './dom';

type HTMLAttributeReferrerPolicy =
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

export interface HTMLAttributes<E extends HTMLElement>
  extends AriaAttributes,
    CSSAttributes,
    DOMEventAttributes<E> {
  // Standard HTML Attributes
  accessKey?: string;
  contentEditable?: boolean | 'inherit';
  contextMenu?: string;
  dir?: string;
  draggable?: boolean;
  hidden?: boolean;
  id?: string;
  lang?: string;
  placeholder?: string;
  spellCheck?: 'true' | 'false';
  tabIndex?: number;
  title?: string;
  translate?: 'yes' | 'no';

  // Unknown
  radioGroup?: string; // <command>, <menuitem>

  // WAI-ARIA
  role?: string;

  // RDFa Attributes
  about?: string;
  datatype?: string;
  inlist?: boolean;
  prefix?: string;
  property?: string;
  resource?: string;
  typeof?: string;
  vocab?: string;

  // Non-standard Attributes
  autoCapitalize?: 'on' | 'off' | 'words' | 'characters';
  autoCorrect?: 'on' | 'off';
  autoSave?: string;
  color?: string;
  itemProp?: string;
  itemScope?: boolean;
  itemType?: string;
  itemID?: string;
  itemRef?: string;
  results?: number;
  security?: string;
  unselectable?: 'on' | 'off';

  // Living Standard
  /**
   * Hints at the type of data that might be entered by the user while editing the element or its contents
   * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
   */
  inputmode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
  /**
   * Specify that a standard HTML element should behave like a defined custom built-in element
   * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
   */
  is?: string;
}

export interface HTMLAnchorAttributes<
  T extends HTMLAnchorElement = HTMLAnchorElement
> extends HTMLAttributes<T> {
  download?: string | boolean;
  href?: string;
  hrefLang?: string;
  media?: string;
  ping?: string;
  rel?: string;
  target?: string;
  type?: string;
  referrerPolicy?: HTMLAttributeReferrerPolicy;
}

export interface HTMLAreaAttributes<T extends HTMLAreaElement = HTMLAreaElement>
  extends HTMLAttributes<T> {
  alt?: string;
  coords?: string;
  download?: string | boolean;
  href?: string;
  hrefLang?: string;
  media?: string;
  referrerPolicy?: HTMLAttributeReferrerPolicy;
  rel?: string;
  shape?: string;
  target?: string;
}

export interface HTMLAudioAttributes<
  T extends HTMLAudioElement = HTMLAudioElement
> extends HTMLMediaAttributes<T> {}

export interface HTMLBaseAttributes<T extends HTMLBaseElement = HTMLBaseElement>
  extends HTMLAttributes<T> {
  href?: string;
  target?: string;
}

export interface HTMLBlockquoteAttributes<
  T extends HTMLQuoteElement = HTMLQuoteElement
> extends HTMLAttributes<T> {
  cite?: string;
}

export interface HTMLButtonAttributes<
  T extends HTMLButtonElement = HTMLButtonElement
> extends HTMLAttributes<T> {
  autoFocus?: boolean;
  disabled?: boolean;
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  name?: string;
  type?: 'submit' | 'reset' | 'button';
  value?: string | ReadonlyArray<string> | number;
}

export interface HTMLCanvasAttributes<
  T extends HTMLCanvasElement = HTMLCanvasElement
> extends HTMLAttributes<T> {
  height?: number;
  width?: number;
}

export interface HTMLColAttributes<
  T extends HTMLTableColElement = HTMLTableColElement
> extends HTMLAttributes<T> {
  span?: number;
  width?: number;
}

export interface HTMLColgroupAttributes<
  T extends HTMLTableColElement = HTMLTableColElement
> extends HTMLAttributes<T> {
  span?: number;
}

export interface HTMLDataAttributes<T extends HTMLDataElement = HTMLDataElement>
  extends HTMLAttributes<T> {
  value?: string | ReadonlyArray<string> | number;
}

export interface HTMLDetailsAttributes<
  T extends HTMLDetailsElement = HTMLDetailsElement
> extends HTMLAttributes<T> {
  open?: boolean;
}

export interface HTMLDelAttributes<T extends HTMLModElement = HTMLModElement>
  extends HTMLAttributes<T> {
  cite?: string;
  dateTime?: string;
}

export interface HTMLDialogAttributes<
  T extends HTMLDialogElement = HTMLDialogElement
> extends HTMLAttributes<T> {
  open?: boolean;
}

export interface HTMLEmbedAttributes<
  T extends HTMLEmbedElement = HTMLEmbedElement
> extends HTMLAttributes<T> {
  height?: number;
  src?: string;
  type?: string;
  width?: number;
}

export interface HTMLFieldsetAttributes<
  T extends HTMLFieldSetElement = HTMLFieldSetElement
> extends HTMLAttributes<T> {
  disabled?: boolean;
  form?: string;
  name?: string;
}

export interface HTMLFormAttributes<T extends HTMLFormElement = HTMLFormElement>
  extends HTMLAttributes<T> {
  acceptCharset?: string;
  action?: string;
  autoComplete?: string;
  encType?: string;
  method?: string;
  name?: string;
  noValidate?: boolean;
  target?: string;
}

export interface HTMLHtmlAttributes<T extends HTMLHtmlElement = HTMLHtmlElement>
  extends HTMLAttributes<T> {
  manifest?: string;
}

export interface HTMLIframeAttributes<
  T extends HTMLIFrameElement = HTMLIFrameElement
> extends HTMLAttributes<T> {
  allow?: string;
  allowFullscreen?: boolean;
  allowTransparency?: boolean;
  /** @deprecated */
  frameBorder?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  /** @deprecated */
  marginHeight?: number;
  /** @deprecated */
  marginWidth?: number;
  name?: string;
  referrerPolicy?: HTMLAttributeReferrerPolicy;
  sandbox?: string;
  /** @deprecated */
  scrolling?: string;
  seamless?: boolean;
  src?: string;
  srcDoc?: string;
  width?: number;
}

export interface HTMLImgAttributes<
  T extends HTMLImageElement = HTMLImageElement
> extends HTMLAttributes<T> {
  alt?: string;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  decoding?: 'async' | 'auto' | 'sync';
  height?: number;
  sizes?: string;
  src?: string;
  srcset?: string;
  useMap?: string;
  width?: number;
}

export interface HTMLInsAttributes<T extends HTMLModElement = HTMLModElement>
  extends HTMLAttributes<T> {
  cite?: string;
  dateTime?: string;
}

type HTMLInputTypeAttribute =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

export interface HTMLInputAttributes<
  T extends HTMLInputElement = HTMLInputElement
> extends HTMLAttributes<T> {
  accept?: string;
  alt?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  capture?: boolean | 'user' | 'environment';
  checked?: boolean;
  crossOrigin?: string;
  disabled?: boolean;
  enterKeyHint?:
    | 'enter'
    | 'done'
    | 'go'
    | 'next'
    | 'previous'
    | 'search'
    | 'send';
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  height?: number;
  list?: string;
  max?: number;
  maxLength?: number;
  min?: number;
  minLength?: number;
  multiple?: boolean;
  name?: string;
  pattern?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: number;
  src?: string;
  step?: number;
  type?: HTMLInputTypeAttribute;
  value?: string | ReadonlyArray<string> | number;
  width?: number;
}

export interface HTMLKeygenAttributes<T extends HTMLElement = HTMLElement>
  extends HTMLAttributes<T> {
  autoFocus?: boolean;
  challenge?: string;
  disabled?: boolean;
  form?: string;
  keyType?: string;
  keyParams?: string;
  name?: string;
}

export interface HTMLLabelAttributes<
  T extends HTMLLabelElement = HTMLLabelElement
> extends HTMLAttributes<T> {
  form?: string;
  htmlFor?: string;
}

export interface HTMLLiAttributes<T extends HTMLLIElement = HTMLLIElement>
  extends HTMLAttributes<T> {
  value?: string | ReadonlyArray<string> | number;
}

export interface HTMLLinkAttributes<T extends HTMLLinkElement = HTMLLinkElement>
  extends HTMLAttributes<T> {
  as?: string;
  charSet?: string;
  crossOrigin?: string;
  href?: string;
  hrefLang?: string;
  integrity?: string;
  media?: string;
  imageSrcSet?: string;
  referrerPolicy?: HTMLAttributeReferrerPolicy;
  rel?: string;
  sizes?: string;
  type?: string;
}

export interface HTMLMapAttributes<T extends HTMLMapElement = HTMLMapElement>
  extends HTMLAttributes<T> {
  name?: string;
}

export interface HTMLMenuAttributes<T extends HTMLMenuElement = HTMLMenuElement>
  extends HTMLAttributes<T> {
  type?: string;
}

export interface HTMLMediaAttributes<
  T extends HTMLMediaElement = HTMLMediaElement
> extends HTMLAttributes<T> {
  autoPlay?: boolean;
  controls?: boolean;
  controlsList?: string;
  crossOrigin?: string;
  loop?: boolean;
  mediaGroup?: string;
  muted?: boolean;
  playsInline?: boolean;
  preload?: string;
  src?: string;
}

export interface HTMLMetaAttributes<T extends HTMLMetaElement = HTMLMetaElement>
  extends HTMLAttributes<T> {
  charSet?: string;
  content?: string;
  httpEquiv?: string;
  name?: string;
  media?: string;
}

export interface HTMLMeterAttributes<
  T extends HTMLMeterElement = HTMLMeterElement
> extends HTMLAttributes<T> {
  form?: string;
  high?: number;
  low?: number;
  max?: number;
  min?: number;
  optimum?: number;
  value?: string | ReadonlyArray<string> | number;
}

export interface HTMLQuoteAttributes<
  T extends HTMLQuoteElement = HTMLQuoteElement
> extends HTMLAttributes<T> {
  cite?: string;
}

export interface HTMLObjectAttributes<
  T extends HTMLObjectElement = HTMLObjectElement
> extends HTMLAttributes<T> {
  classID?: string;
  data?: string;
  form?: string;
  height?: number;
  name?: string;
  type?: string;
  useMap?: string;
  width?: number;
  wmode?: string;
}

export interface HTMLOlAttributes<T extends HTMLOListElement = HTMLOListElement>
  extends HTMLAttributes<T> {
  reversed?: boolean;
  start?: number;
  type?: '1' | 'a' | 'A' | 'i' | 'I';
}

export interface HTMLOptgroupAttributes<
  T extends HTMLOptGroupElement = HTMLOptGroupElement
> extends HTMLAttributes<T> {
  disabled?: boolean;
  label?: string;
}

export interface HTMLOptionAttributes<
  T extends HTMLOptionElement = HTMLOptionElement
> extends HTMLAttributes<T> {
  disabled?: boolean;
  label?: string;
  selected?: boolean;
  value?: string | ReadonlyArray<string> | number;
}

export interface HTMLOutputAttributes<
  T extends HTMLOutputElement = HTMLOutputElement
> extends HTMLAttributes<T> {
  form?: string;
  htmlFor?: string;
  name?: string;
}

export interface HTMLParamAttributes<
  T extends HTMLParamElement = HTMLParamElement
> extends HTMLAttributes<T> {
  name?: string;
  value?: string | ReadonlyArray<string> | number;
}

export interface HTMLProgressAttributes<
  T extends HTMLProgressElement = HTMLProgressElement
> extends HTMLAttributes<T> {
  max?: number;
  value?: string | ReadonlyArray<string> | number;
}

export interface HTMLScriptAttributes<
  T extends HTMLScriptElement = HTMLScriptElement
> extends HTMLAttributes<T> {
  async?: boolean;
  charSet?: string;
  crossOrigin?: string;
  defer?: boolean;
  integrity?: string;
  noModule?: boolean;
  nonce?: string;
  src?: string;
  type?: string;
}

export interface HTMLSelectAttributes<
  T extends HTMLSelectElement = HTMLSelectElement
> extends HTMLAttributes<T> {
  autoComplete?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  form?: string;
  multiple?: boolean;
  name?: string;
  required?: boolean;
  size?: number;
  value?: string | ReadonlyArray<string> | number;
}

export interface HTMLSlotAttributes<T extends HTMLSlotElement = HTMLSlotElement>
  extends HTMLAttributes<T> {
  name?: string;
}

export interface HTMLSourceAttributes<
  T extends HTMLSourceElement = HTMLSourceElement
> extends HTMLAttributes<T> {
  height?: number;
  media?: string;
  sizes?: string;
  src?: string;
  srcSet?: string;
  type?: string;
  width?: number | string;
}

export interface HTMLStyleAttributes<
  T extends HTMLStyleElement = HTMLStyleElement
> extends HTMLAttributes<T> {
  media?: string;
  nonce?: string;
  scoped?: boolean;
  type?: string;
}

export interface HTMLTableAttributes<
  T extends HTMLTableElement = HTMLTableElement
> extends HTMLAttributes<T> {
  cellPadding?: number;
  cellSpacing?: number;
  summary?: string;
  width?: number | string;
}

export interface HTMLTextareaAttributes<
  T extends HTMLTextAreaElement = HTMLTextAreaElement
> extends HTMLAttributes<T> {
  autoComplete?: string;
  autoFocus?: boolean;
  cols?: number;
  dirName?: string;
  disabled?: boolean;
  form?: string;
  maxLength?: number;
  minLength?: number;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
  value?: string | ReadonlyArray<string> | number;
  wrap?: string;
}

export interface HTMLTdAttributes<
  T extends HTMLTableDataCellElement = HTMLTableDataCellElement
> extends HTMLAttributes<T> {
  abbr?: string;
  align?: 'left' | 'center' | 'right' | 'justify' | 'char';
  colSpan?: number;
  headers?: string;
  height?: number | string;
  rowSpan?: number;
  scope?: string;
  valign?: 'top' | 'middle' | 'bottom' | 'baseline';
  width?: number | string;
}

export interface HTMLThAttributes<
  T extends HTMLTableHeaderCellElement = HTMLTableHeaderCellElement
> extends HTMLAttributes<T> {
  abbr?: string;
  align?: 'left' | 'center' | 'right' | 'justify' | 'char';
  colSpan?: number;
  headers?: string;
  rowSpan?: number;
  scope?: string;
}

export interface HTMLTimeAttributes<T extends HTMLTimeElement = HTMLTimeElement>
  extends HTMLAttributes<T> {
  dateTime?: string;
}

export interface HTMLTrackAttributes<
  T extends HTMLTrackElement = HTMLTrackElement
> extends HTMLAttributes<T> {
  default?: boolean;
  kind?: string;
  label?: string;
  src?: string;
  srcLang?: string;
}

export interface HTMLVideoAttributes<
  T extends HTMLVideoElement = HTMLVideoElement
> extends HTMLMediaAttributes<T> {
  disablePictureInPicture?: boolean;
  disableRemotePlayback?: boolean;
  height?: number;
  playsInline?: boolean;
  poster?: string;
  width?: number;
}

export interface HTMLWebViewAttributes<
  T extends HTMLWebViewElement = HTMLWebViewElement
> extends HTMLAttributes<T> {
  allowFullScreen?: boolean;
  allowPopups?: boolean;
  autoFocus?: boolean;
  autoSize?: boolean;
  blinkFeatures?: string;
  disableBlinkFeatures?: string;
  disableGuestResize?: boolean;
  disableWebSecurity?: boolean;
  guestInstance?: string;
  httpReferrer?: string;
  nodeIntegration?: boolean;
  partition?: string;
  plugins?: boolean;
  preload?: string;
  src?: string;
  userAgent?: string;
  webPreferences?: string;
}
