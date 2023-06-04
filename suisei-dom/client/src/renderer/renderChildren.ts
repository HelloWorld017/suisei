import {
  createPrimitives,
  ErrorCodes,
  isPromise,
  isRef,
  throwWarn,
} from 'suisei/unsafe-internals';
import type {
  ClientRenderer,
  ClientRenderResult,
} from '../types';
import type { Children, Primitives, SuiseiElement } from 'suisei';
import type {
  ContextRegistry,
  NodeValue,
  Owner,
} from 'suisei/unsafe-internals';

export const renderChildPrimitive = async (
  renderer: ClientRenderer,
  element: SuiseiElement | string | number | null,
  primitives: Primitives
) => {
  if (typeof element === 'string' || typeof element === 'number') {
    const node = document.createTextNode(String(element));
  }
  if (__DEV__) {
    const renderCache = renderer.elementMap.get(element);
    if (renderCache) {
      throwWarn(ErrorCodes.E_ELEMENT_MOVE);
    }
  }

  return renderer.render(element);
};

export const renderChild = (
  renderer: ClientRenderer,
  owner: Owner,
  primitives: Primitives,
  child: NodeValue,
  { shouldEscape = true } = {}
): ClientRenderResult => {
  if (isRef(child)) {
    const initialElement = renderChild(
      renderer,
      owner,
      primitives,
      primitives.useOnce(child),
      { shouldEscape }
    );

    let age = 0;
    let committedHandle: ElementHandle | null = null;

    if (isPromise(initialElement)) {
      void initialElement.then(handle => {
        if (!committedHandle) {
          committedHandle = handle;
        }
      });
    }
      const updateElement = async () => {
        const lastAge = age;
        let childHandle = renderChild(
          renderer,
          owner,
          primitives,
          childElement,
          { shouldEscape }
        );

        if (isPromise(childHandle)) {
          childHandle = await childHandle;
        }

        if (lastAge < age) {
          return;
        }

        if (committedHandle) {
          committedHandle.alternate(childHandle);
      };

    primitives.effectLayout(_ => {
      // TODO check for defer flag
      const childElement = _(child);
    });
  }
};

export const renderChildren = async (
  renderer: ClientRenderer,
  owner: Owner,
  primitives: Primitives,
  children: Children,
  { shouldEscape = true } = {}
) => {
  const promises: Promise<void>[] = [];

  children
    .flatMap(child => {
      if (isRef(child)) {
        return primitives.useOnce(child);
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
  return children;
};
