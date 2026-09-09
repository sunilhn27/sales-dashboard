import { useMemo } from 'react';
import { useSalesData } from './useSalesData';
import { getBrandMetrics } from '@/lib/data/aggregations';

export function useBrandMetrics() {
  const rows = useSalesData();
  return useMemo(() => getBrandMetrics(rows), [rows]);
}
