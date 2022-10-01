import {
  createPrimitives,
  readContext,
  wrapProps,
  ErrorBoundaryContext,
  SuspenseContext,
  SuspenseContextType,
} from '@suisei/core';
import { assertsIsElement, isElement, isPromise, isRef } from '@suisei/shared';
import { encodeEntities } from '../shared';
import { ServerRendererContext } from './contexts/ServerRendererContext';
import {
  createHtmlChunk,
  createHtmlOpenChunk,
  createSuspenseInitInlineScript,
  createSuspenseInlineScript,
} from './utils';
import type { ServerRenderer } from './types';
import type {
  Children,
  Component,
  ContextRegistry,
  Depropize,
  Element,
  Propize,
  PropsBase,
} from '@suisei/core';
import type { ElementsAttributes } from '@suisei/htmltypes';
import type { Owner } from '@suisei/reactivity';

const getRendererFromRegistry = (
  contextRegistry: ContextRegistry
): ServerRenderer => readContext(contextRegistry, ServerRendererContext);

const createOwner = (
  renderer: ServerRenderer,
  contextRegistry: ContextRegistry
): Owner => ({
  scheduler: renderer.scheduler,
  stateCount: 0,
  onEffectInitialize() {},
  onEffectSyncInitialize() {},
  onFutureRefetchInitialize() {},
  onFutureRefetchFinish() {},
  onError(error) {
    const errorBoundary = readContext(contextRegistry, ErrorBoundaryContext);
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
  contextRegistry: ContextRegistry,
  children: Children,
  { shouldEscape = true } = {}
): RenderResult => {
  const promises: Promise<void>[] = [];
  const renderer = getRendererFromRegistry(contextRegistry);
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
        const result = render(child, contextRegistry);
        if (result) {
          promises.push(result);
        }

        return;
      }

      if (child === null) {
        return;
      }

      renderer.emit(
        shouldEscape ? encodeEntities(String(child)) : String(child)
      );
    });

  if (promises.length === 0) {
    return;
  }

  return Promise.allSettled(promises).then(() => {});
};

const renderSuspendedElement = (
  contextRegistry: ContextRegistry,
  suspense: SuspenseContextType,
  children: Children
) => {
  const renderer = getRendererFromRegistry(contextRegistry);
  const [suspendedRenderer, suspendedRendererCork] =
    renderer.getChildRenderer();

  const nextRegistry = {
    ...contextRegistry,
    [SuspenseContext.key]: suspense,
    [ServerRendererContext.key]: suspendedRenderer,
  };

  const childrenResult = renderChildren(nextRegistry, children);
  if (!childrenResult) {
    // No promises are registered, just uncork
    renderer.uncork(suspendedRendererCork, () => {});
    return;
  }

  if (!suspense.fallback) {
    return childrenResult.then(() => {
      renderer.uncork(suspendedRendererCork);
    });
  }

  const suspenseId = `${
    renderer.config.namespace.templateId
  }:${renderer.allocateId()}`;

  // Should not render with next registry
  renderer.emit(createHtmlChunk('template', { id: suspenseId }, ''));

  const fallbackBoundary = `<!--/${suspenseId}-->`;
  const fallbackResult = render(suspense.fallback, contextRegistry);
  const promises = [childrenResult];
  if (fallbackResult) {
    promises.push(fallbackResult.then(() => renderer.emit(fallbackBoundary)));
  } else {
    renderer.emit(fallbackBoundary);
  }

  return Promise.allSettled(promises).then(() => {
    const replacementId = `${
      renderer.config.namespace.templateId
    }:${renderer.allocateId()}`;
    suspendedRenderer.uncork(() => {
      suspendedRenderer.emit(
        createHtmlChunk('template', { id: replacementId }, '')
      );
    });

    suspendedRenderer.emit(`<!--/${replacementId}-->`);

    if (!renderer.renderedInitScripts.has('suspense')) {
      suspendedRenderer.emit(
        createHtmlChunk(
          'script',
          {},
          createSuspenseInitInlineScript(
            renderer.config.namespace.namespace,
            renderer.config.nonce
          )
        )
      );
    }

    suspendedRenderer.emit(
      createHtmlChunk(
        'script',
        {},
        createSuspenseInlineScript(
          renderer.config.namespace.namespace,
          suspenseId,
          replacementId,
          renderer.config.nonce
        )
      )
    );
  });
};

const renderFragmentElement = (
  contextRegistry: ContextRegistry,
  props: Record<string, unknown>,
  provide: Record<symbol, unknown> | null,
  children: Children
): RenderResult => {
  const renderer = getRendererFromRegistry(contextRegistry);
  let nextRegistry = contextRegistry;

  if (provide) {
    nextRegistry = { ...contextRegistry, ...provide };

    if (SuspenseContext.key in provide) {
      const suspenseContext = readContext(nextRegistry, SuspenseContext);
      return renderSuspendedElement(contextRegistry, suspenseContext, children);
    }
  }

  const shouldEscape = !props.raw;
  const childrenResult = renderChildren(nextRegistry, children, {
    shouldEscape,
  });

  if (!childrenResult) {
    return;
  }

  return childrenResult;
};

export const renderComponentElement = <P extends PropsBase>(
  contextRegistry: ContextRegistry,
  component: Component<P>,
  props: Propize<P>,
  children: P['children']
): RenderResult => {
  const renderer = getRendererFromRegistry(contextRegistry);
  const owner = createOwner(renderer, contextRegistry);
  const $ = createPrimitives(contextRegistry, owner);

  const propsWrapped = wrapProps(props, $);
  propsWrapped.children = children;

  let result;
  try {
    result = component(propsWrapped, $);
  } catch (err) {
    owner.onError(err);
    return;
  }

  if (!isPromise(result)) {
    return render(result, contextRegistry);
  }

  // Prevent other elements being flushed
  renderer.cork();

  return result
    .then(element => {
      // Render and flush other elements
      renderer.uncork(() => render(element, contextRegistry));
    })
    .catch(err => {
      // TODO handle errors for async component
      owner.onError(err);
    });
};

export const renderIntrinsicElement = <C extends keyof ElementsAttributes>(
  contextRegistry: ContextRegistry,
  component: C,
  props: Depropize<ElementsAttributes[C]>,
  children: Children
): RenderResult => {
  const renderer = getRendererFromRegistry(contextRegistry);
  const owner = createOwner(renderer, contextRegistry);
  const $ = createPrimitives(contextRegistry, owner);

  const propsWrapped = wrapProps(props, $) as ElementsAttributes[C];
  renderer.emit(createHtmlOpenChunk(component, propsWrapped));

  const renderResult = renderChildren(contextRegistry, children);
  const closingChunk = `</${component}>`;

  if (isPromise(renderResult)) {
    return renderResult.then(() => renderer.emit(closingChunk));
  }

  renderer.emit(closingChunk);
};

export const render = (
  element: Element,
  contextRegistry: ContextRegistry = {}
): RenderResult => {
  assertsIsElement(element);

  if (element.component === null) {
    return renderFragmentElement(
      contextRegistry,
      element.props,
      element.provide,
      element.children
    );
  }

  if (typeof element.component === 'string') {
    return renderIntrinsicElement(
      contextRegistry,
      element.component as keyof ElementsAttributes,
      element.props,
      element.children
    );
  }

  return renderComponentElement(
    contextRegistry,
    element.component,
    element.props,
    element.children
  );
};
