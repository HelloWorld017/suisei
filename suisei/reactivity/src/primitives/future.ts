import { observeRef } from '../utils';
import { state } from './state';
import type { Owner, Ref } from '../types';

export const future =
  (owner: Owner): PrimitiveFuture =>
  async <T>(ref: Ref<Promise<T>>) => {
    let epoch = 0;
    const futureSymbol = Symbol();
    const [value, setValue] = state(owner)<T>(null as unknown as T);
    const [promise, unobserve] = observeRef(owner, ref, (newPromise, flags) => {
      const currentEpoch = epoch;
      const refetchPromise = newPromise.then(newValue => {
        if (currentEpoch < epoch) {
          return;
        }

        epoch += 1;
        setValue(newValue);
      });

      owner.onFutureUpdate(futureSymbol, refetchPromise, flags);
    });

    owner.onFutureInitialize(futureSymbol, promise, unobserve);

    const initialValue = await promise;
    setValue(initialValue);

    return value;
  };

export type PrimitiveFuture = <T>(ref: Ref<Promise<T>>) => Promise<Ref<T>>;
