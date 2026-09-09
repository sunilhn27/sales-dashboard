import { useMemo } from 'react';
import { useSalesData } from './useSalesData';
import { getLocationMetrics } from '@/lib/data/aggregations';

export function useLocationMetrics() {
  const rows = useSalesData();
  return useMemo(() => getLocationMetrics(rows), [rows]);
}