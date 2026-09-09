import { useMemo } from 'react';
import { useSalesData } from './useSalesData';
import { getChannelMetrics } from '@/lib/data/aggregations';

export function useChannelMetrics() {
  const rows = useSalesData();
  return useMemo(() => getChannelMetrics(rows), [rows]);
}
