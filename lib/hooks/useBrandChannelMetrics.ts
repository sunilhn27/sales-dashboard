import { useMemo } from 'react';
import { useSalesData } from './useSalesData';
import { getBrandChannelMetrics } from '@/lib/data/aggregations';

export function useBrandChannelMetrics() {
  const rows = useSalesData();
  return useMemo(() => getBrandChannelMetrics(rows), [rows]);
}