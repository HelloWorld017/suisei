import { Scheduler } from "@suisei/scheduler";
import type { Effect } from "./Effect";
import type { Ref } from "./Ref";

export type Owner = {
	key: string;
	scheduler: Scheduler;
	stateCount: number;
	onEffectBeforeInitialize(effect: Effect): void;
	onEffectSyncInitialize(effect: Effect): void;
	onError(error: any): void;
	onStateUpdate(ref: Ref<any>): void;
};
