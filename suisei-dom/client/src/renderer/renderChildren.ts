import {
  createPrimitives,
  ErrorCodes,
  isPromise,
  isRef,
  throwError,
} from 'suisei/unsafe-internals';
import type {
  ClientRenderer,
  ClientRenderResult,
  ElementHandle,
} from '../types';
import type { Children, Primitives, SuiseiElement } from 'suisei';
import type {
  ContextRegistry,
  NodeValue,
  Owner,
} from 'suisei/unsafe-internals';

export const renderChildElement = async (
  renderer: ClientRenderer,
  element: SuiseiElement,
  primitives: Primitives
) => {
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
    const previousElement = renderChild(
      renderer,
      owner,
      primitives,
      primitives.useOnce(child),
      { shouldEscape }
    );

    let committedHandle: ElementHandle | null = null;
    if (isPromise(previousElement)) {
      void previousElement.then(handle => {
        committedHandle = handle;
      });
    }

    primitives.effectLayout(_ => {
      // TODO check for defer flag
      const childElement = _(child);
      const updateElement = () => {
        if (committedHandle === null) {
          if (isPromise(previousElement)) {
            void previousElement.then(() => updateElement());
          }

          return;
        }

        const childHandle = renderChild(
          renderer,
          owner,
          primitives,
          childElement,
          { shouldEscape }
        );
        if (isPromise(childHandle)) {
          const committedHandleNow = committedHandle;
          childHandle.then(() => {
            if (committedHandleNow === committedHandle) {
            }
          });
        }
        committedHandle.alternate(childHandle);
      };
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

function throwWarn(arg0: any) {
  throw new Error('Function not implemented.');
}
function throwWarn(arg0: any) {
  throw new Error('Function not implemented.');
}

