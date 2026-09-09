'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import type { SalesRow } from '@/types/sales';

interface SalesReturnTrendProps {
  data: SalesRow[];
}

export function SalesReturnTrend({ data }: SalesReturnTrendProps) {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  return (
    <div>
      <Tabs
        value={period}
        onValueChange={(v) => setPeriod(v as 'daily' | 'weekly' | 'monthly')}
      >
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <TrendLineChart data={data} period="daily" />
        </TabsContent>
        <TabsContent value="weekly">
          <TrendLineChart data={data} period="weekly" />
        </TabsContent>
        <TabsContent value="monthly">
          <TrendLineChart data={data} period="monthly" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
