import { useMemo } from 'react';
import { useSalesData } from './useSalesData';
import { getTopCategoryMetrics } from '@/lib/data/aggregations';

export function useTopCategoryMetrics() {
  const rows = useSalesData();
  return useMemo(() => getTopCategoryMetrics(rows), [rows]);
}