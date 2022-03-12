import { assertsIsRef, isPromise } from "@suisei/shared";
import { owner } from "../owner";
import { EffectCleanup, EffectHandle, ExtractRefOrRefs, RefOrRefs } from "../types";
import { useOnce } from "./useOnce";

type EffectOption = { runAt?: 'before' | 'sync' };

export const effect = <R extends RefOrRefs>(
	refOrRefs: R,
	effectFn: (values: ExtractRefOrRefs<R>, effectHandle: EffectHandle)
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

				const newCleanup = effectFn(useOnce(refOrRefs), effectHandle);

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
		const refs = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs];
		const observers = (refs as unknown[]).map(() => () => runEffect());

		refs.forEach((ref, index) => {
			assertsIsRef(ref);
			ref.observers.add(observers[index]);
		});

		return () => {
			refs.forEach((ref, index) => {
				assertsIsRef(ref);
				ref.observers.delete(observers[index]);
			});

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

export const effectBefore = <R extends RefOrRefs>(
	refOrRefs: R,
	effectFn: (values: ExtractRefOrRefs<R>, effectHandle: EffectHandle)
		=> void | EffectCleanup | Promise<void | EffectCleanup>,
	options?: Omit<EffectOption, 'runAt'>
) => effect(refOrRefs, effectFn, { ...options, runAt: 'before' });
