import {
  KIND_REF,
  REF_KIND_STATE,
  SymbolIs,
  SymbolRefDescriptor,
} from '@suisei/shared';
import { createDependencyMap } from '../createDependencyMap';
import type { DependencyMap } from '../../types/DependencyMap';
import type { StateRefInternal } from '../../types/Ref';

const createEmptyRef = (): StateRefInternal => ({
  [SymbolIs]: KIND_REF,
  [SymbolRefDescriptor]: {
    kind: REF_KIND_STATE,
    isReadwrite: true,
  },
});

const expectTraverse = (
  depsMap: DependencyMap,
  parent: StateRefInternal,
  children: StateRefInternal[]
) => {
  const onTraverse = vi.fn();
  depsMap.traverse(parent, onTraverse);
  expect(onTraverse).toHaveBeenCalledTimes(children.length);

  children.forEach(child => {
    expect(onTraverse).toHaveBeenCalledWith(child);
  });
};

it('basic add / traversing child should work', () => {
  const refA = createEmptyRef();
  const refB = createEmptyRef();
  const refC = createEmptyRef();

  const depsMap = createDependencyMap();
  depsMap.add(refA, refB, undefined, depsMap.rewrite(refB));
  depsMap.add(refA, refC, undefined, depsMap.rewrite(refC));

  expectTraverse(depsMap, refA, [refB, refC]);
});

describe('overlay map', () => {
  it.skip('forking should work', () => {
    const depsMap = createDependencyMap();
    const refA = createEmptyRef();
    const refB = createEmptyRef();
    const refC = createEmptyRef();
    const refD = createEmptyRef();

    const keyC = depsMap.rewrite(refC);
    const keyD = depsMap.rewrite(refD);
    depsMap.add(refA, refC, undefined, keyC);
    depsMap.add(refB, refD, undefined, keyD);
    depsMap.add(refC, refD, undefined, keyD);

    expectTraverse(depsMap, refA, [refC]);
    expectTraverse(depsMap, refB, [refD]);
    expectTraverse(depsMap, refC, [refD]);

    const overlayMap = depsMap.fork();
    const overlayKeyB = overlayMap.rewrite(refB);
    overlayMap.add(refB, refC, undefined, keyC);
    expectTraverse(depsMap, refC, [refB, refD]);

    depsMap.rewrite(refA);
    expectTraverse(depsMap, refA, []);
  });

  it('should apply modifications on apply', () => {});
});
