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
import { cn } from '@/lib/utils';
import type { SalesRow } from '@/types/sales';

const chartConfig = {
  salesValue: { label: 'Sales Value', color: 'var(--chart-1)' },
  returnValue: { label: 'Return Value', color: 'var(--chart-2)' },
} satisfies ChartConfig;

interface TrendLineChartProps {
  data: SalesRow[];
  period: 'daily' | 'weekly' | 'monthly';
  className?: string;
}

export function TrendLineChart({ data, period, className }: TrendLineChartProps) {
  const chartData = useMemo(() => {
    const grouped = new Map<
      string,
      { date: string; label: string; salesValue: number; returnValue: number }
    >();

    for (const row of data) {
      const date = new Date(row.invoiceDate);
      let key: string;
      let label: string;

      if (period === 'daily') {
        key = format(date, 'yyyy-MM-dd');
        label = format(date, 'MMM d');
      } else if (period === 'weekly') {
        key = format(date, "yyyy-'W'ww");
        label = format(date, 'MMM d');
      } else {
        key = format(date, 'yyyy-MM');
        label = format(date, 'MMM yyyy');
      }

      if (!grouped.has(key)) {
        grouped.set(key, { date: key, label, salesValue: 0, returnValue: 0 });
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
    <ChartContainer config={chartConfig} className={cn('h-80 w-full', className)}>
      <LineChart data={chartData}>
        {/* stroke #ccc lets the shadcn chart theme (light/dark border) color the grid */}
        <CartesianGrid
          vertical={false}
          stroke="#ccc"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          tickMargin={8}
          minTickGap={28}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          tickMargin={8}
          width={70}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="salesValue"
          stroke="var(--color-salesValue)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="returnValue"
          stroke="var(--color-returnValue)"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
      </LineChart>
    </ChartContainer>
  );
}