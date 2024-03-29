import { throwError, ErrorCodes } from '@suisei/shared';
import { readRef } from '../utils';
import { derive } from './derive';
import type { Owner, Ref } from '../types';

type Decomposed<T> = T extends object
  ? { [K in keyof T]: Decomposed<T[K]> } & Ref<T>
  : Ref<T>;

export const decompose = (owner: Owner): PrimitiveDecompose => {
  const deriveWithOwner = derive(owner);
  const decomposeImpl = <T>(ref: Ref<T>): Decomposed<T> =>
    new Proxy<Decomposed<T>>(ref as Decomposed<T>, {
      get(target, key) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          return target[key as keyof Decomposed<T>];
        }

        return decomposeImpl(
          deriveWithOwner(_ => {
            const value = _(target);
            if (!(key in value)) {
              return undefined;
            }

            return (value as T)[key as keyof T];
          })
        );
      },

      set(_target, key) {
        return throwError(ErrorCodes.E_SET_ON_DECOMPOSE, key);
      },

      ownKeys(target) {
        const value = readRef(owner, target);
        return Reflect.ownKeys(value).concat(Reflect.ownKeys(target));
      },

      has(target, key) {
        const value = readRef(owner, target);
        return Reflect.has(value, key) || Reflect.has(target, key);
      },

      isExtensible() {
        return false;
      },
    });

  return decomposeImpl;
};

export type PrimitiveDecompose = <T>(ref: Ref<T>) => Decomposed<T>;
