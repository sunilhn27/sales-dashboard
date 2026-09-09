import { useMemo } from 'react';
import { useSalesData } from './useSalesData';
import { getStoreMetrics } from '@/lib/data/aggregations';

export function useStoreMetrics() {
  const rows = useSalesData();
  return useMemo(() => getStoreMetrics(rows), [rows]);
}
