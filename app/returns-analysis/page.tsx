'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useSalesData } from '@/lib/hooks/useSalesData';
import { formatINR, formatNumber, formatPct } from '@/lib/utils/format';

const TrendLineChart = dynamic(
  () =>
    import('@/components/charts/TrendLineChart').then((mod) => ({
      default: mod.TrendLineChart,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 w-full" />,
  }
);

export default function ReturnsAnalysisPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  );
  const rows = useSalesData();

  const returnRows = useMemo(
    () => rows.filter((r) => r.transactionType === 'SR' || r.transactionType === 'IR'),
    [rows]
  );

  const returnStats = useMemo(() => {
    const totalReturn = returnRows.reduce((s, r) => s + Math.abs(r.value), 0);
    const totalReturnQty = returnRows.reduce(
      (s, r) => s + Math.abs(r.totalSalesQty),
      0
    );
    return { totalReturn, totalReturnQty, count: returnRows.length };
  }, [returnRows]);

  return (
    <PageWrapper
      title="Returns Analysis"
      description="Deep-dive into sales returns"
    >
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Return Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatINR(returnStats.totalReturn)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Return Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(returnStats.totalReturnQty)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Number of Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(returnStats.count)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Return Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={period}
            onValueChange={(v) =>
              setPeriod(v as 'daily' | 'weekly' | 'monthly')
            }
          >
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <TrendLineChart data={returnRows} period="daily" />
            </TabsContent>
            <TabsContent value="weekly">
              <TrendLineChart data={returnRows} period="weekly" />
            </TabsContent>
            <TabsContent value="monthly">
              <TrendLineChart data={returnRows} period="monthly" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
