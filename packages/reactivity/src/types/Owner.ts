import type { Effect } from "./Effect";
import type { Ref } from "./Ref";
import type { Scheduler } from "@suisei/core";

export type Owner = {
	scheduler: Scheduler;
	stateCount: number;
	onEffectBeforeInitialize(effect: Effect): void;
	onEffectSyncInitialize(effect: Effect): void;
	onError(error: any): void;
	onStateUpdate(ref: Ref<any>): void;
};
