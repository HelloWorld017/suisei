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
import {RenderEnv} from '../env';

export const renderChildPrimitive = async (
  { renderer }: RenderEnv,
  element: SuiseiElement | string | number | null,
) => {
  if (typeof element === 'string' || typeof element === 'number') {
    const node = document.createTextNode(String(element));
    return node;
  }

  if (!element) {
    return null;
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
  env: RenderEnv,
  child: NodeValue,
  { shouldEscape = true } = {}
): ClientRenderResult => {
  const { renderer, owner, primitives } = env;

  if (isRef(child)) {
    const initialElement = renderChild(
      env,
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
  { renderer, owner, primitives }: RenderEnv,
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
