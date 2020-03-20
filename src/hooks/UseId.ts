import { DependencyList, useMemo } from 'react';
import { uniqueId } from '../UniqueId';

export const useId = (prefix: string, deps?: DependencyList) =>
  useMemo(() => uniqueId(prefix), deps || []);
