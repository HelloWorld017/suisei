import { EffectCleanup, isPromise } from 'suisei/unsafe-internals';

export const cleanupAll =
  (cleanups: EffectCleanup[]): EffectCleanup =>
  () => {
    const cleanupPromises = cleanups.reduce((cleanupPromises, cleanup) => {
      const cleanupPromise = cleanup();
      if (isPromise(cleanupPromise)) {
        cleanupPromises.push(cleanupPromise);
      }

      return cleanupPromises;
    }, [] as Promise<void>[]);

    if (cleanupPromises.length > 0) {
      return Promise.all(cleanupPromises).then(() => {});
    }
  };
