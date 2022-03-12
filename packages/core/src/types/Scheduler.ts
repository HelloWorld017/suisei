export const enum SchedulerPriority {
	HIGHEST = 50,
	LOWEST = 1,
};

export type SchedulerLane = number;
export type Scheduler = {
	createLane(priority: number): SchedulerLane;
	runWithLane(lane: SchedulerLane, fn: () => {}): void;
	queueTask(task: () => void): number;
};
