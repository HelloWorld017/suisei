import { observeRef } from '../utils';
import { state } from './state';
import type { Owner, Ref } from '../types';

export const future =
  (owner: Owner): PrimitiveFuture =>
  async <T>(ref: Ref<Promise<T>>) => {
    const [value, setValue] = state(owner)<T>(null as unknown as T);
    const [promise, unobserve] = observeRef(owner, ref, newPromise => {
      const refetchPromise = newPromise.then(newValue => {
        setValue(newValue);
        owner.onFutureRefetchFinish(refetchPromise);
      });

      owner.onFutureRefetchInitialize(refetchPromise);
    });

    owner.onEffectSyncInitialize(() => unobserve);

    const initialValue = await promise;
    setValue(initialValue);

    return value;
  };

export type PrimitiveFuture = <T>(ref: Ref<Promise<T>>) => Promise<Ref<T>>;
