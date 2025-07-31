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
  depsMap.forEachChild(parent, onTraverse);
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
  depsMap.add(depsMap.rewrite(refB), refA, refB);
  depsMap.add(depsMap.rewrite(refC), refA, refC);

  expectTraverse(depsMap, refA, [refB, refC]);
});

describe('overlay map', () => {
  it('forking should work', () => {
    const depsMap = createDependencyMap();
    const refA = createEmptyRef();
    const refB = createEmptyRef();
    const refC = createEmptyRef();
    const refD = createEmptyRef();

    const keyC = depsMap.rewrite(refC);
    const keyD = depsMap.rewrite(refD);
    depsMap.add(keyC, refA, refC);
    depsMap.add(keyD, refB, refD);
    depsMap.add(keyD, refC, refD);

    expectTraverse(depsMap, refA, [refC]);
    expectTraverse(depsMap, refB, [refD]);
    expectTraverse(depsMap, refC, [refD]);

    const overlayMap = depsMap.fork();
    const overlayKeyB = overlayMap.rewrite(refB);
    overlayMap.add(keyC, refB, refC);
    expectTraverse(depsMap, refC, [refB, refD]);

    depsMap.rewrite(refA);
    expectTraverse(depsMap, refA, []);
  });

  it('should apply modifications on apply', () => {});
});
