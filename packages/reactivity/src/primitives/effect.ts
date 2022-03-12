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
	let currentCleanup: EffectCleanup | Promise<EffectCleanup | void> | null = null;
	let isCancelled = false;
	const effectHandle: EffectHandle = {
		isCancelled: () => isCancelled
	};

	const runEffect = (isFinal = false) => {
		if (currentTaskId !== null) {
			return;
		}

		if (isPromise<void | EffectCleanup>(currentCleanup)) {
			isCancelled = true;
			currentCleanup
				.then((cleanupFn) => {
					currentCleanup = cleanupFn || (() => {});
					owner.scheduler.queueTaskImmediate(runEffect);
				})
				.catch((error) => {
					owner.onError(error);
				});

			return;
		}

		const cleanupFn = currentCleanup;
		owner.scheduler.queueTaskImmediate(() => {
			if (cleanupFn) {
				cleanupFn();
			}

			if (isFinal) {
				return;
			}

			try {
				currentCleanup = effectFn(useOnce(refOrRefs), effectHandle) || (() => {});
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
		const observers = (refs as unknown[]).map(() => () => runEffect(false));

		refs.forEach((ref, index) => {
			assertsIsRef(ref);
			ref.observers.add(observers[index]);
		});

		return () => {
			refs.forEach((ref, index) => {
				assertsIsRef(ref);
				ref.observers.delete(observers[index]);
			});

			runEffect(true);
		};
	});
};

export const effectBefore = <R extends RefOrRefs>(
	refOrRefs: R,
	effectFn: (values: ExtractRefOrRefs<R>, effectHandle: EffectHandle)
		=> void | EffectCleanup | Promise<void | EffectCleanup>,
	options?: Omit<EffectOption, 'runAt'>
) => effect(refOrRefs, effectFn, { ...options, runAt: 'before' });
