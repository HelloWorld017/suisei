export const enum SchedulerPriority {
	HIGH = 50,
	LOW = 1,
};

export type Scheduler = {
	queueTask (task: () => void, priority: number): number;
	queueDependentTask (task: () => void): number;
};
