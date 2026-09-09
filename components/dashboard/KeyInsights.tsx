'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';
import { useBrandMetrics } from '@/lib/hooks/useBrandMetrics';
import { useStoreMetrics } from '@/lib/hooks/useStoreMetrics';
import { useChannelMetrics } from '@/lib/hooks/useChannelMetrics';

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
        value: `${topBrand.brandName} (${(topBrand.salesValue / 10000000).toFixed(2)} Cr)`,
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
    <Card>
      <CardHeader>
        <CardTitle>Key Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                {insight.icon}
                <span className="text-sm font-medium">{insight.title}</span>
              </div>
              <Badge variant={insight.type === 'success' ? 'default' : insight.type === 'warning' ? 'secondary' : 'outline'}>
                {insight.value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
