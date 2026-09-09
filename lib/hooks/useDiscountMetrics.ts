import { useMemo } from 'react';
import { useSalesData } from './useSalesData';
import { getDiscountMetrics } from '@/lib/data/aggregations';

export function useDiscountMetrics() {
  const rows = useSalesData();
  return useMemo(() => getDiscountMetrics(rows), [rows]);
}
