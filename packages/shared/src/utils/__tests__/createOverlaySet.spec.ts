import { createOverlaySet } from '../createOverlaySet';

it('basic work', () => {
  const set = new Set([1, 2, 3, 4]);
  const overlaySet = createOverlaySet(set);
  overlaySet.add(5);
  overlaySet.add(6);

  expect([...set]).toStrictEqual([1, 2, 3, 4]);
  expect(overlaySet.has(5)).toBe(true);
  expect(overlaySet.delete(4)).toBe(true);
  expect(overlaySet.delete(6)).toBe(true);
  expect(overlaySet.has(6)).toBe(false);

  const callback = vi.fn();
  overlaySet.forEach(callback);
  expect(callback.mock.calls).toStrictEqual([[1], [2], [3], [5]]);

  overlaySet.commit();
  expect([...set]).toStrictEqual([1, 2, 3, 5]);
});
