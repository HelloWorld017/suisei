import {
  MAX_SCHEDULER_PRIORITY,
  MIN_SCHEDULER_PRIORITY,
} from '../../constants';
import { createDefaultScheduler } from '../createDefaultScheduler';
import type { Scheduler, SchedulerTask } from '../../types/Scheduler';

describe('createDefaultScheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should run tasks by priority (higher numerical priority first)', () => {
    const scheduler = createDefaultScheduler({});
    const executionOrder: number[] = [];

    const taskP1: SchedulerTask = () => executionOrder.push(1);
    const taskP2: SchedulerTask = () => executionOrder.push(2);
    const taskP3: SchedulerTask = () => executionOrder.push(3);

    scheduler.queueTask(1, taskP1);
    scheduler.queueTask(3, taskP3);
    scheduler.queueTask(2, taskP2);
    vi.runAllTimers();

    expect(executionOrder).toEqual([3, 2, 1]);
  });

  it('should schedule appended tasks right after the current task in the same lane', () => {
    const scheduler = createDefaultScheduler({});
    const executionOrder: string[] = [];

    const appendedTask: SchedulerTask = () => {
      executionOrder.push('appended');
    };

    const mainTask: SchedulerTask = (_scheduler, node) => {
      executionOrder.push('main');
      node.append(appendedTask);
    };

    scheduler.queueTask(1, mainTask);
    vi.runAllTimers();

    expect(executionOrder).toEqual(['main', 'appended']);
  });

  it('should pause processing when time limit is exceeded and resume on the next tick', () => {
    const executionOrder: string[] = [];
    let tickCallbacks: (() => void)[] = [];
    const mockRequestNextTick = vi.fn((callback: () => void) =>
      tickCallbacks.push(callback)
    );

    const scheduler = createDefaultScheduler({
      limit: 10,
      requestNextTick: mockRequestNextTick,
    });

    const task1: SchedulerTask = () => {
      executionOrder.push('Task1');
      vi.advanceTimersByTime(15);
    };

    const task2: SchedulerTask = () => {
      executionOrder.push('Task2');
      vi.advanceTimersByTime(5);
    };

    const task3: SchedulerTask = () => {
      executionOrder.push('Task3');
      vi.advanceTimersByTime(6);
    };

    scheduler.queueTask(MIN_SCHEDULER_PRIORITY, task1);
    scheduler.queueTask(MIN_SCHEDULER_PRIORITY, task2);
    scheduler.queueTask(MIN_SCHEDULER_PRIORITY, task3);

    expect(mockRequestNextTick).toHaveBeenCalledTimes(1);

    tickCallbacks[0]();
    tickCallbacks.shift();

    expect(executionOrder).toEqual(['Task1']);
    expect(mockRequestNextTick).toHaveBeenCalledTimes(2);

    tickCallbacks[0]();
    tickCallbacks.shift();

    expect(executionOrder).toEqual(['Task1', 'Task2', 'Task3']);
    expect(mockRequestNextTick).toHaveBeenCalledTimes(2);
  });

  it('should execute all queued render tasks and correctly prioritize them with other tasks', () => {
    const executionOrder: string[] = [];
    const nextTickCallbacks: (() => void)[] = [];
    const renderTickCallbacks: (() => void)[] = [];
    const mockRequestNextTick = vi.fn((callback: () => void) =>
      nextTickCallbacks.push(callback)
    );

    const mockRequestNextRenderTick = vi.fn((callback: () => void) =>
      renderTickCallbacks.push(callback)
    );

    const scheduler: Scheduler = createDefaultScheduler({
      requestNextTick: mockRequestNextTick,
      requestNextRenderTick: mockRequestNextRenderTick,
    });

    const taskP1: SchedulerTask = () => executionOrder.push('P1');
    const taskPMax: SchedulerTask = () => executionOrder.push('PMax');
    const renderTask1: SchedulerTask = () => executionOrder.push('Render1');
    const renderTask2: SchedulerTask = () => executionOrder.push('Render2');

    scheduler.queueTask(MAX_SCHEDULER_PRIORITY, taskPMax);
    scheduler.queueTaskForRender(renderTask1);
    scheduler.queueTask(1, taskP1);
    scheduler.queueTaskForRender(renderTask2);

    expect(mockRequestNextTick).toHaveBeenCalledTimes(1);
    expect(mockRequestNextRenderTick).toHaveBeenCalledTimes(1);

    renderTickCallbacks.forEach(cb => cb());
    renderTickCallbacks.length = 0;

    expect(executionOrder).toEqual(['Render1', 'Render2', 'PMax']);

    nextTickCallbacks.forEach(cb => cb());
    nextTickCallbacks.length = 0;

    expect(executionOrder).toEqual(['Render1', 'Render2', 'PMax', 'P1']);

    scheduler.queueTaskForRender(() => executionOrder.push('Render3'));
    expect(mockRequestNextRenderTick).toHaveBeenCalledTimes(2);

    renderTickCallbacks.forEach(cb => cb());

    expect(executionOrder).toEqual([
      'Render1',
      'Render2',
      'PMax',
      'P1',
      'Render3',
    ]);
  });
});
