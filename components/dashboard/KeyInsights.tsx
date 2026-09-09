'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';
import { useBrandMetrics } from '@/lib/hooks/useBrandMetrics';
import { useStoreMetrics } from '@/lib/hooks/useStoreMetrics';
import { useChannelMetrics } from '@/lib/hooks/useChannelMetrics';
import { formatINRCrores } from '@/lib/utils/format';

export function KeyInsights() {
  const brandMetrics = useBrandMetrics();
  const storeMetrics = useStoreMetrics();
  const channelMetrics = useChannelMetrics();

  const insights = useMemo(() => {
    const result: Array<{
      icon: React.ReactNode;
      title: string;
      value: string;
      type: 'success' | 'warning' | 'info';
    }> = [];

    if (brandMetrics.length > 0) {
      const topBrand = brandMetrics.reduce((best, current) =>
        current.salesValue > best.salesValue ? current : best
      );
      result.push({
        icon: <Award className="h-4 w-4 text-amber-500" />,
        title: 'Top Brand',
        value: `${topBrand.brandName} (${formatINRCrores(topBrand.salesValue)})`,
        type: 'success',
      });

      const lowestReturnBrand = brandMetrics
        .filter((b) => b.returnPct > 0)
        .reduce(
          (best, current) =>
            current.returnPct < best.returnPct ? current : best,
          brandMetrics[0]
        );
      if (lowestReturnBrand) {
        result.push({
          icon: <TrendingDown className="h-4 w-4 text-green-500" />,
          title: 'Lowest Return Rate',
          value: `${lowestReturnBrand.brandName} (${lowestReturnBrand.returnPct.toFixed(2)}%)`,
          type: 'success',
        });
      }
    }

    if (storeMetrics.length > 0) {
      const topStore = storeMetrics[0];
      result.push({
        icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
        title: 'Top Store',
        value: `${topStore.storeName} (${topStore.sharePct.toFixed(1)}% share)`,
        type: 'info',
      });
    }

    if (channelMetrics.length > 0) {
      const highReturnChannel = channelMetrics.find(
        (c) => c.returnPct > 10
      );
      if (highReturnChannel) {
        result.push({
          icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
          title: 'High Return Channel',
          value: `${highReturnChannel.channel} (${highReturnChannel.returnPct.toFixed(2)}%)`,
          type: 'warning',
        });
      }
    }

    return result;
  }, [brandMetrics, storeMetrics, channelMetrics]);

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/5"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm dark:bg-white/10">
              {insight.icon}
            </span>
            <span className="text-sm font-medium">{insight.title}</span>
          </div>
          <Badge
            variant={
              insight.type === 'success'
                ? 'secondary'
                : insight.type === 'warning'
                  ? 'outline'
                  : 'outline'
            }
            className="shrink-0 bg-white text-foreground dark:bg-white/10"
          >
            {insight.value}
          </Badge>
        </div>
      ))}
    </div>
  );
}
