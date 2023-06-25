import { cleanupAll } from '@suisei-dom/shared';
import {
  EffectCleanup,
  ErrorCodes,
  isConstantRef,
  isPromise,
  isRef,
  throwWarn,
} from 'suisei/unsafe-internals';
import { RenderEnv } from '../env';
import type { ClientRenderResult } from '../types';
import type { Children, SuiseiElement } from 'suisei';
import type { NodeValue } from 'suisei/unsafe-internals';

export const renderChildPrimitive = (
  { renderer }: RenderEnv,
  element: SuiseiElement | string | number | null,
  { raw = false } = {}
): ClientRenderResult => {
  if (typeof element === 'string' || typeof element === 'number') {
    if (!raw) {
      return [document.createTextNode(String(element)), null];
    }

    const node = document.createElement('template');
    node.innerHTML = String(element);
    return [node.content, null];
  }

  if (!element) {
    return [null, null];
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
  { raw = false } = {}
): ClientRenderResult => {
  const { primitives, unmount } = env;
  const options = { raw };

  if (isRef(child)) {
    const initialElement = renderChild(env, primitives.useOnce(child), options);
    if (isConstantRef(child)) {
      return initialElement;
    }

    let epoch = 0;
    let lastChildNode: Node | null = null;
    let lastUnmountChild: EffectCleanup | null = null;

    const wrapper = document.createDocumentFragment();
    const updateChild = async (
      updateEpoch: number,
      renderResult: ClientRenderResult,
      _flags?: number
    ): Promise<boolean> => {
      // TODO check for defer flag
      const [childNode, unmountChild] = isPromise(renderResult)
        ? await renderResult
        : renderResult;

      if (updateEpoch < epoch) {
        void unmountChild?.();
        return false;
      }

      void lastUnmountChild?.();
      if (lastChildNode) {
        wrapper.removeChild(lastChildNode);
      }

      if (childNode) {
        wrapper.appendChild(childNode);
      }

      epoch += 1;
      lastChildNode = childNode;
      lastUnmountChild = unmountChild;

      return true;
    };

    void updateChild(epoch, initialElement);
    primitives.effectLayout((_, handle) => {
      const childElement = _(child);
      void updateChild(
        epoch,
        renderChild(env, childElement, options),
        handle.flags
      );
    });

    const cleanup = async () => {
      await lastUnmountChild?.();
      await unmount();
    };

    const output = [wrapper, cleanup] as const;
    return isPromise(initialElement)
      ? initialElement.then(() => output)
      : output;
  }

  if (Array.isArray(child)) {
    const renderResults = child.map(childPrimitive => {
      return renderChildPrimitive(env, childPrimitive, options);
    });

    const renderPromise = Promise.all(renderResults);
    return renderPromise.then(renderResult => {
      const wrapper = document.createDocumentFragment();
      const cleanups: EffectCleanup[] = [];
      renderResult.forEach(([childNode, unmountChild]) => {
        if (childNode) {
          wrapper.appendChild(childNode);
        }

        if (unmountChild) {
          cleanups.push(unmountChild);
        }
      });

      return [wrapper, cleanupAll(cleanups)];
    });
  }

  return renderChildPrimitive(env, child, options);
};

export const renderChildren = (
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
      // TODO call renderChild
    });

  return children;
};
