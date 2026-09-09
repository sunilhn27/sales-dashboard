'use client';

import { Progress } from '@/components/ui/progress';
import { formatINR, formatPct } from '@/lib/utils/format';
import type { StoreMetric } from '@/types/metrics';

interface StoreBarsProps {
  data: StoreMetric[];
}

export function StoreBars({ data }: StoreBarsProps) {
  return (
    <div className="space-y-4">
      {data.map((store) => (
        <div key={store.storeCode} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{store.storeName}</p>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <span className="text-sm text-muted-foreground">
                {formatINR(store.salesValue)}
              </span>
              <span className="text-sm font-medium w-16 text-right">
                {formatPct(store.sharePct)}
              </span>
            </div>
          </div>
          <Progress value={store.sharePct} className="h-2" />
        </div>
      ))}
    </div>
  );
}
