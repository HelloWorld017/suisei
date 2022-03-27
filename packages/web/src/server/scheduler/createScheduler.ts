import type { Scheduler } from "@suisei/core";

export const createScheduler = (): Scheduler => {
	let taskId = 0;

	return {
		queueTask(task) {
			task();
			return taskId++;
		},

		createLane() {
			return 0;
		},

		runWithLane(_, fn) {
			fn();
		}
	};
};
