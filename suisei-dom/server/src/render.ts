import { encodeEntities, isVoidElement } from '@suisei-dom/shared';
import { $$ as globalPrimitives } from 'suisei';
import {
  assertsIsElement,
  createPrimitives,
  isElement,
  isPromise,
  isRef,
  readContext,
  unwrapProps,
  wrapProps,
  ErrorBoundaryContext,
  SuspenseContext,
} from 'suisei/unsafe-internals';
import {
  createHtmlChunk,
  createHtmlOpenChunk,
  createSuspenseInitInlineScript,
  createSuspenseInlineScript,
} from './utils';
import type { ServerRenderer } from './types';
import type { SuiseiElementsAttributes } from '@suisei-dom/shared';
import type {
  Children,
  Component,
  SuiseiElement as Element,
  Ref,
  PropsBase,
} from 'suisei';
import type {
  ContextRegistry,
  Depropize,
  Propize,
  Owner,
  SuspenseContextType,
} from 'suisei/unsafe-internals';

const createOwner = (
  renderer: ServerRenderer,
  contextRegistry: ContextRegistry
): Owner => ({
  stateCount: 0,
  onDeriveUpdateByObserve(_ref, _flags, runDerive) {
    // FIXME This might cause updates for already rendered element
    // We will not support, and we should make sure client renderer handle this.
    runDerive();
  },
  onEffectInitialize() {},
  onEffectUpdate() {},
  onFutureInitialize() {
    // TODO hand-off future data
  },
  onFutureUpdate() {},
  onError(error) {
    const errorBoundary = globalPrimitives.useOnce(
      readContext(contextRegistry, ErrorBoundaryContext)
    );

    // FIXME fix error boundary
    if (errorBoundary) {
      errorBoundary(error);
      return;
    }

    throw error;
  },
  onStateUpdate(_ref) {},
});

type RenderResult = Promise<void> | void;

const renderChildren = (
  renderer: ServerRenderer,
  contextRegistry: ContextRegistry,
  children: Children,
  { shouldEscape = true } = {}
): RenderResult => {
  const promises: Promise<void>[] = [];
  const owner = createOwner(renderer, contextRegistry);
  const $ = createPrimitives(contextRegistry, owner);

  children
    .flatMap(child => {
      if (isRef(child)) {
        return $.useOnce(child);
      }

      return child;
    })
    .forEach(child => {
      if (isElement(child)) {
        const result = render(renderer, child, contextRegistry);
        if (result) {
          promises.push(result);
        }

        return;
      }

      if (child === null || child === undefined) {
        return;
      }

      renderer.emit(
        shouldEscape ? encodeEntities(String(child)) : String(child)
      );
    });

  if (promises.length === 0) {
    return;
  }

  return Promise.all(promises).then(() => {});
};

const renderSuspendedElement = (
  renderer: ServerRenderer,
  contextRegistry: ContextRegistry,
  suspenseRef: Ref<SuspenseContextType>,
  children: Children
) => {
  const suspense = globalPrimitives.useOnce(suspenseRef);
  const suspendedRenderer = renderer.forkRenderer();
  const namespace = renderer.config.namespace.templateId;

  const nextRegistry = {
    ...contextRegistry,
    [SuspenseContext.key]: suspenseRef,
  };

  const childrenResult = renderChildren(renderer, nextRegistry, children);
  if (!childrenResult) {
    // No promises are registered, just uncork
    renderer.mergeRenderer(suspendedRenderer);
    return;
  }

  if (!suspense.fallback) {
    // No fallback
    // > Wait until the promises resolve and uncork
    return childrenResult.then(() => {
      renderer.mergeRenderer(suspendedRenderer);
    });
  }

  // Uncork, but write ours later with `mergeRenderer`
  renderer.yieldRenderer(suspendedRenderer);

  // Should not render fallback with next registry
  const suspenseId = `${namespace}:${renderer.allocateId()}`;
  renderer.emit(createHtmlChunk('template', { id: suspenseId }, ''));

  const promises = [childrenResult];
  const fallbackBoundary = `<!--/${suspenseId}-->`;
  const fallbackResult = render(renderer, suspense.fallback, contextRegistry);
  renderer.emit(fallbackBoundary);

  if (fallbackResult) {
    promises.push(fallbackResult);
  }

  return Promise.all(promises).then(() => {
    const replacementId = `${namespace}:${renderer.allocateId()}`;
    suspendedRenderer.emit(`<!--/${replacementId}-->`);

    let scriptPreamble = '';
    if (!renderer.renderedInitScripts.has('suspense')) {
      scriptPreamble += createSuspenseInitInlineScript(
        renderer.config.namespace.namespace
      );
    }

    suspendedRenderer.emit(
      createHtmlChunk(
        'script',
        { nonce: renderer.config.nonce },
        scriptPreamble +
          createSuspenseInlineScript(
            renderer.config.namespace.namespace,
            suspenseId,
            replacementId
          )
      )
    );

    renderer.mergeRenderer(suspendedRenderer, () => {
      renderer.emit(createHtmlChunk('template', { id: replacementId }, ''));
    });
  });
};

const renderFragmentElement = (
  renderer: ServerRenderer,
  contextRegistry: ContextRegistry,
  props: Record<string, unknown>,
  provide: Record<symbol, Ref<unknown>> | null
): RenderResult => {
  let children: Children = [];
  if ('children' in props) {
    const childrenProp = props.children as Children | Ref<Children>;

    if (isRef(childrenProp)) {
      const owner = createOwner(renderer, contextRegistry);
      const $ = createPrimitives(contextRegistry, owner);
      children = $.useOnce(childrenProp);
    } else {
      children = childrenProp;
    }
  }

  let nextRegistry = contextRegistry;

  if (provide) {
    nextRegistry = { ...contextRegistry, ...provide };

    if (SuspenseContext.key in provide) {
      return renderSuspendedElement(
        renderer,
        contextRegistry,
        readContext(nextRegistry, SuspenseContext) as Ref<SuspenseContextType>,
        children
      );
    }
  }

  const shouldEscape = !props.raw;
  const options = { shouldEscape };
  return renderChildren(renderer, nextRegistry, children, options);
};

export const renderComponentElement = <P extends PropsBase>(
  renderer: ServerRenderer,
  contextRegistry: ContextRegistry,
  component: Component<P>,
  props: Propize<P>
): RenderResult => {
  const owner = createOwner(renderer, contextRegistry);
  const $ = createPrimitives(contextRegistry, owner);

  const propsWrapped = wrapProps(props, $);

  let result;
  try {
    result = component(propsWrapped as PropsBase as P, $);
  } catch (err) {
    owner.onError(err);
    return;
  }

  if (!isPromise(result)) {
    return render(renderer, result, contextRegistry);
  }

  // Prevent other elements being flushed
  // > As we are the source of the promises, we should guarantee corking
  const componentRenderer = renderer.forkRenderer();

  return (
    result
      // Render and flush other elements
      .then(element => render(componentRenderer, element, contextRegistry))
      .then(() => renderer.mergeRenderer(componentRenderer))
      .catch(err => {
        // TODO handle errors for async component
        owner.onError(err);
      })
  );
};

export const renderIntrinsicElement = <
  C extends keyof SuiseiElementsAttributes
>(
  renderer: ServerRenderer,
  contextRegistry: ContextRegistry,
  component: C,
  props: Depropize<SuiseiElementsAttributes[C]>
): RenderResult => {
  const owner = createOwner(renderer, contextRegistry);
  const $ = createPrimitives(contextRegistry, owner);

  const propsUnwrapped = unwrapProps(props, $) as SuiseiElementsAttributes[C];
  renderer.emit(createHtmlOpenChunk(component, propsUnwrapped));

  if (isVoidElement(component)) {
    return;
  }

  let renderResult: void | Promise<void>;
  if (propsUnwrapped.children) {
    renderResult = renderChildren(
      renderer,
      contextRegistry,
      propsUnwrapped.children
    );
  }

  renderer.emit(`</${component}>`);
  return renderResult;
};

// WARN You should not wait for the `render()`.
// > But if you're dealing with the `renderer.mergeRenderer()`, you should wait for it
export const render = (
  renderer: ServerRenderer,
  element: Element,
  contextRegistry: ContextRegistry = {}
): RenderResult => {
  assertsIsElement(element);

  if (element.component === null) {
    return renderFragmentElement(
      renderer,
      contextRegistry,
      element.props,
      element.provide
    );
  }

  if (typeof element.component === 'string') {
    return renderIntrinsicElement(
      renderer,
      contextRegistry,
      element.component as keyof SuiseiElementsAttributes,
      element.props
    );
  }

  return renderComponentElement(
    renderer,
    contextRegistry,
    element.component,
    element.props
  );
};
