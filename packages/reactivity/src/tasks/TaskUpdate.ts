import { REF_KIND_DERIVED, SymbolRefDescriptor } from '@suisei/shared';
import { readRef } from '../utils/readRef';
import type {
  ReactivityRegistry,
  ReactivityRegistryInternal,
} from '../types/ReactivityRegistry';
import type { RefInternal } from '../types/Ref';
import type { SchedulerTask } from '@suisei/core';

export const TaskUpdate =
  (registry: ReactivityRegistry): SchedulerTask =>
  (_scheduler, node) => {
    const internalRegistry = registry as ReactivityRegistryInternal;
    const tasks = internalRegistry._depsTasks;
    const nextValue = tasks.values().next();

    const ref = nextValue.value;
    if (!ref) {
      return;
    }

    const internalRef = ref as RefInternal;
    if (
      internalRef[SymbolRefDescriptor].kind === REF_KIND_DERIVED &&
      internalRef[SymbolRefDescriptor].isMemoized
    ) {
      readRef(registry, ref);
    }

    node.append(TaskUpdate(registry));
  };
