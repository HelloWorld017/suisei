import type { Effect } from "./Effect";
import type { Ref } from "./Ref";
import type { Scheduler } from "@suisei/core";

export type Owner = {
	scheduler: Scheduler;
	stateCount: number;
	onEffectSyncInitialize(effect: Effect): void;
	onEffectInitialize(effect: Effect): void;
	onError(error: any): void;
	onFutureRefetchInitialize(promise: Promise<any>): void;
	onFutureRefetchFinish(promise: Promise<any>): void;
	onStateUpdate(ref: Ref<any>): void;
};
