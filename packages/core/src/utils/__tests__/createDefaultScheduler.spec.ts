import { createDefaultScheduler } from '../createDefaultScheduler';

it('should run tasks immediately', () => {
  const scheduler = createDefaultScheduler();
  const task = vi.fn();
  scheduler.queueTask(0, task);
  expect(task).toHaveBeenCalled();

  const task2 = vi.fn();
  scheduler.queueTaskForRender(task2);
  expect(task2).toHaveBeenCalled();
});
