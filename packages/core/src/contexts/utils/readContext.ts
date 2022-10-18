import type { Context, ContextRegistry, Ref } from '../../types';

export const readContext = <T>(
  contextRegistry: ContextRegistry,
  context: Context<T>
): Ref<T> => {
  if (context.key in contextRegistry) {
    return (contextRegistry as { [K in typeof context.key]: Ref<T> })[
      context.key
    ];
  }

  return context.defaultValue;
};
