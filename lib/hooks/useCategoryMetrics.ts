import { useMemo } from 'react';
import { useSalesData } from './useSalesData';
import { getCategoryMetrics } from '@/lib/data/aggregations';

export function useCategoryMetrics() {
  const rows = useSalesData();
  return useMemo(() => getCategoryMetrics(rows), [rows]);
}
