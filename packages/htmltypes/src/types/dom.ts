export interface DOMEvents {
  // Clipboard Events
  onCopy: ClipboardEvent;
  onCut: ClipboardEvent;
  onPaste: ClipboardEvent;

  // Composition Events
  onCompositionEnd: CompositionEvent;
  onCompositionStart: CompositionEvent;
  onCompositionUpdate: CompositionEvent;

  // Focus Events
  onFocus: FocusEvent;
  onBlur: FocusEvent;

  // Form Events
  onChange: Event;
  onBeforeInput: Event;
  onInput: Event;
  onReset: Event;
  onSubmit: Event;
  onInvalid: Event;

  // Image Events
  onLoad: Event;
  onError: Event; // also a Media Event
  onErrorCapture: Event; // also a Media Event

  // Keyboard Events
  onKeyDown: KeyboardEvent;
  /** @deprecated */
  onKeyPress: KeyboardEvent;
  /** @deprecated */
  onKeyUp: KeyboardEvent;

  // Media Events
  onAbort: Event;
  onCanPlay: Event;
  onCanPlayThrough: Event;
  onDurationChange: Event;
  onEmptied: Event;
  onEncrypted: Event;
  onEnded: Event;
  onLoadedData: Event;
  onLoadedMetadata: Event;
  onLoadStart: Event;
  onPause: Event;
  onPlay: Event;
  onPlaying: Event;
  onProgress: Event;
  onRateChange: Event;
  onSeeked: Event;
  onSeeking: Event;
  onStalled: Event;
  onSuspend: Event;
  onTimeUpdate: Event;
  onToggle: Event;
  onVolumeChange: Event;
  onWaiting: Event;

  // MouseEvents
  onAuxClick: MouseEvent;
  onClick: MouseEvent;
  onContextMenu: MouseEvent;
  onDoubleClick: MouseEvent;
  onDrag: DragEvent;
  onDragEnd: DragEvent;
  onDragEnter: DragEvent;
  onDragExit: DragEvent;
  onDragLeave: DragEvent;
  onDragOver: DragEvent;
  onDragStart: DragEvent;
  onDrop: DragEvent;
  onMouseDown: MouseEvent;
  onMouseEnter: MouseEvent;
  onMouseLeave: MouseEvent;
  onMouseMove: MouseEvent;
  onMouseOut: MouseEvent;
  onMouseOver: MouseEvent;
  onMouseUp: MouseEvent;

  // Selection Events
  onSelect: Event;

  // Touch Events
  onTouchCancel: TouchEvent;
  onTouchEnd: TouchEvent;
  onTouchMove: TouchEvent;
  onTouchStart: TouchEvent;

  // Pointer Events
  onPointerDown: PointerEvent;
  onPointerMove: PointerEvent;
  onPointerUp: PointerEvent;
  onPointerCancel: PointerEvent;
  onPointerEnter: PointerEvent;
  onPointerLeave: PointerEvent;
  onPointerOver: PointerEvent;
  onPointerOut: PointerEvent;

  // UI Events
  onScroll: UIEvent;

  // Wheel Events
  onWheel: WheelEvent;

  // Animation Events
  onAnimationStart: AnimationEvent;
  onAnimationEnd: AnimationEvent;
  onAnimationIteration: AnimationEvent;

  // Transition Events
  onTransitionEnd: TransitionEvent;
}

export type DOMTargetedEvents<E> = {
  [K in keyof DOMEvents]?: Omit<DOMEvents[K], 'currentTarget'> & {
    readonly currentTarget: E;
  };
};

export type DOMEventAttributes<E> = {
  [K in keyof DOMEvents]?:
    | ((event: DOMTargetedEvents<E>[K]) => void)
    | ((event: DOMEvents[K]) => void);
};
