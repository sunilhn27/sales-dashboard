import { useMemo } from 'react';
import { useDataStore } from '@/lib/store/useDataStore';
import { useFilterStore } from '@/lib/store/useFilterStore';
import type { SalesRow } from '@/types/sales';

export function useSalesData(): SalesRow[] {
  const { rows } = useDataStore();
  const { dateRange, brands, channels, quarters } = useFilterStore();

  return useMemo(() => {
    return rows.filter((r) => {
      const inDate =
        (!dateRange.from || r.invoiceDate >= dateRange.from) &&
        (!dateRange.to || r.invoiceDate <= dateRange.to);
      const inBrand = brands.length === 0 || brands.includes(r.brandCode);
      const inChannel = channels.length === 0 || channels.includes(r.channel);
      const inQuarter = quarters.length === 0 || quarters.includes(r.quarter);
      return inDate && inBrand && inChannel && inQuarter;
    });
  }, [rows, dateRange, brands, channels, quarters]);
}
