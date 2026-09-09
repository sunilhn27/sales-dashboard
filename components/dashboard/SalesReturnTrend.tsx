'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { DashboardCard, getSpanClass } from '@/components/dashboard/DashboardCard';
import { useDashboardLayout } from '@/lib/store/useDashboardLayout';
import type { SalesRow } from '@/types/sales';

interface SalesReturnTrendProps {
  data: SalesRow[];
  className?: string;
}

export function SalesReturnTrend({ data, className }: SalesReturnTrendProps) {
  const { spans } = useDashboardLayout();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const handlePeriodChange = (v: string) =>
    setPeriod(v as 'daily' | 'weekly' | 'monthly');

  const span = spans['trend'] ?? 3;

  return (
    <Tabs className={getSpanClass(span)} value={period} onValueChange={handlePeriodChange}>
      <DashboardCard
        id="trend"
        title="Sales Trend"
        description="Sales vs returns over time"
        defaultSpan={3}
        resizable
        headerAction={
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        }
      >
        <TabsContent value="daily">
          <TrendLineChart data={data} period="daily" className={className} />
        </TabsContent>
        <TabsContent value="weekly">
          <TrendLineChart data={data} period="weekly" className={className} />
        </TabsContent>
        <TabsContent value="monthly">
          <TrendLineChart data={data} period="monthly" className={className} />
        </TabsContent>
      </DashboardCard>
    </Tabs>
  );
}