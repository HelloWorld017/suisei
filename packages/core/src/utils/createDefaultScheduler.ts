import type { Scheduler } from '../types';

export const createDefaultScheduler = (): Scheduler => {
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
