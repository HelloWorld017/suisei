import { isPromise } from '@suisei/shared';
import { observeRef, readRef } from '../utils';
import { owner } from '../owner';
import { EffectCleanup, EffectHandle, Ref, RefOrRefs, RefSelector } from '../types';

type EffectOption = { runAt?: 'before' | 'sync' };

export const effect = (
	effectFn: (selector: RefSelector, effectHandle: EffectHandle)
		=> void | EffectCleanup | Promise<void | EffectCleanup>,
	options?: EffectOption
) => {
	let currentTaskId: number | null = null;
	let currentCleanup: EffectCleanup | null = null;
	let currentPromise: Promise<void | EffectCleanup> | null = null;

	let isCancelled = false;
	const effectHandle: EffectHandle = {
		isCancelled: () => isCancelled
	};

	const refCleanups = new Map<Ref<any>, () => void>();
	const runEffect = () => {
		if (currentTaskId !== null) {
			return;
		}

		if (currentPromise) {
			isCancelled = true;

			currentPromise.then(() => {
				try {
					currentCleanup?.();
					runEffect();
				} catch(error) {
					owner.onError(error);
				}
			});
			return;
		}

		const cleanupFn = currentCleanup;
		currentTaskId = owner.scheduler.queueTask(() => {
			isCancelled = false;
			currentTaskId = null;

			try {
				if (cleanupFn) {
					cleanupFn();
				}

				const unusedDependencies = new Set(refCleanups.keys());
				const selector: RefSelector = (refOrRefs: RefOrRefs) => {
					if (Array.isArray(refOrRefs)) {
						return refOrRefs.map(selector);
					}

					if (refCleanups.has(refOrRefs)) {
						unusedDependencies.delete(refOrRefs);
						return readRef(refOrRefs);
					}

					const [value, cleanup] = observeRef(refOrRefs, runEffect);
					refCleanups.set(refOrRefs, cleanup);

					return value;
				};

				const newCleanup = effectFn(selector, effectHandle);
				unusedDependencies.forEach(dependency => {
					refCleanups.get(dependency)?.();
					refCleanups.delete(dependency);
				});

				if (isPromise<void | EffectCleanup>(newCleanup)) {
					currentPromise = newCleanup.then((awaitedNewCleanup) => {
						currentPromise = null;
						currentCleanup = awaitedNewCleanup || null;
					});
				} else if (newCleanup) {
					currentCleanup = newCleanup;
				}
			} catch(error) {
				owner.onError(error);
			}
		});
	};

	const initialize = ((options?.runAt ?? 'sync') === 'sync') ?
		owner.onEffectSyncInitialize :
		owner.onEffectBeforeInitialize;

	initialize(() => {
		return () => {
			refCleanups.forEach(refCleanup => refCleanup());

			if (currentPromise) {
				isCancelled = true;
				return currentPromise.then(() => {
					try {
						currentCleanup?.();
					} catch(error) {
						owner.onError(error);
					}
				});
			}

			try {
				currentCleanup?.();
			} catch(error) {
				owner.onError(error);
			}
		};
	});
};

export const effectBefore = (
	effectFn: (selector: RefSelector, effectHandle: EffectHandle)
		=> void | EffectCleanup | Promise<void | EffectCleanup>,
	options?: Omit<EffectOption, 'runAt'>
) => effect(effectFn, { ...options, runAt: 'before' });
