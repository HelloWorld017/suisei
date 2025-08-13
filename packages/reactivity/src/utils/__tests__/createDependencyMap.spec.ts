import {
  KIND_REF,
  REF_KIND_STATE,
  SymbolIs,
  SymbolRefDescriptor,
} from '@suisei/shared';
import { createDependencyMap } from '../createDependencyMap';
import type {
  DependencyMap,
  OverlayDependencyMap,
} from '../../types/DependencyMap';
import type { StateRefInternal } from '../../types/Ref';

const createEmptyRef = (): StateRefInternal => ({
  [SymbolIs]: KIND_REF,
  [SymbolRefDescriptor]: {
    kind: REF_KIND_STATE,
    isReadwrite: true,
  },
});

const expectTraverse = (
  depsMap: DependencyMap | OverlayDependencyMap,
  parent: StateRefInternal,
  children: StateRefInternal[]
) => {
  const onTraverse = vi.fn();
  depsMap.traverse(parent, onTraverse);
  expect(onTraverse).toHaveBeenCalledTimes(children.length);

  children.forEach(child => {
    expect(onTraverse).toHaveBeenCalledWith(child, null);
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
  it('forking should work', () => {
    const depsMap = createDependencyMap();
    const refA = createEmptyRef();
    const refB = createEmptyRef();
    const refC = createEmptyRef();
    const refD = createEmptyRef();

    const keyC = depsMap.rewrite(refC);
    const keyD = depsMap.rewrite(refD);
    // A -> C -> D | B -> D
    depsMap.add(refA, refC, undefined, keyC);
    depsMap.add(refB, refD, undefined, keyD);
    depsMap.add(refC, refD, undefined, keyD);

    expectTraverse(depsMap, refA, [refC]);
    expectTraverse(depsMap, refB, [refD]);
    expectTraverse(depsMap, refC, [refD]);

    const overlayMap = depsMap.fork();
    const overlayKeyB = overlayMap.rewrite(refB);
    // A -> C -> D | A -> C -> B -> D
    overlayMap.add(refC, refB, undefined, overlayKeyB);
    expectTraverse(overlayMap, refC, [refB, refD]);

    // A -> C -> D | A -> B -> D
    const keyB = depsMap.rewrite(refB);
    depsMap.add(refA, refB, undefined, keyB);
    expectTraverse(depsMap, refC, [refD]);
    expectTraverse(depsMap, refA, [refC, refB]);
    expectTraverse(overlayMap, refC, [refB, refD]);
  });

  it('should apply modifications on apply', () => {});
});
