'use client';

import { useMemo } from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { format } from 'date-fns';
import type { SalesRow } from '@/types/sales';

const chartConfig = {
  salesValue: { label: 'Sales Value', color: 'var(--chart-1)' },
  returnValue: { label: 'Return Value', color: 'var(--chart-2)' },
} satisfies ChartConfig;

interface TrendLineChartProps {
  data: SalesRow[];
  period: 'daily' | 'weekly' | 'monthly';
}

export function TrendLineChart({ data, period }: TrendLineChartProps) {
  const chartData = useMemo(() => {
    const grouped = new Map<
      string,
      { date: string; salesValue: number; returnValue: number }
    >();

    for (const row of data) {
      let key: string;
      const date = new Date(row.invoiceDate);

      if (period === 'daily') {
        key = format(date, 'yyyy-MM-dd');
      } else if (period === 'weekly') {
        key = format(date, "yyyy-'W'ww");
      } else {
        key = format(date, 'yyyy-MM');
      }

      if (!grouped.has(key)) {
        grouped.set(key, { date: key, salesValue: 0, returnValue: 0 });
      }

      const entry = grouped.get(key)!;
      if (row.transactionType === 'IV') {
        entry.salesValue += row.value;
      } else {
        entry.returnValue += Math.abs(row.value);
      }
    }

    return [...grouped.values()].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [data, period]);

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="salesValue"
          stroke="var(--color-salesValue)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="returnValue"
          stroke="var(--color-returnValue)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
