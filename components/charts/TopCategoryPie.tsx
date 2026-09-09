'use client';

import { useMemo } from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { useTopCategoryMetrics } from '@/lib/hooks/useTopCategoryMetrics';
import { formatCompactINR, formatINRCrores } from '@/lib/utils/format';

const PALETTE = ['#3b82f6', '#8b5cf6', '#14b8a6', '#f97316', '#ec4899'];
const OTHERS_COLOR = '#94a3b8';

interface TopCategoryPieProps {
  topN?: number;
}

export function TopCategoryPie({ topN = 5 }: TopCategoryPieProps) {
  const metrics = useTopCategoryMetrics();

  const { chartData, totalSales, chartConfig } = useMemo(() => {
    const totalSales = metrics.reduce((s, m) => s + m.salesValue, 0);
    const top = metrics.slice(0, topN);
    const topTotal = top.reduce((s, m) => s + m.salesValue, 0);
    const rest = totalSales - topTotal;

    const config: ChartConfig = {};
    const data = top.map((m, i) => {
      const color = PALETTE[i % PALETTE.length];
      config[m.category] = { label: m.category, color };
      return { name: m.category, value: m.salesValue, color };
    });

    if (metrics.length > topN && rest > 0) {
      config['Others'] = { label: 'Others', color: OTHERS_COLOR };
      data.push({ name: 'Others', value: rest, color: OTHERS_COLOR });
    }

    return { chartData: data, totalSales, chartConfig: config };
  }, [metrics, topN]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="flex h-80 flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-80 min-w-0 flex-1">
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-bold tracking-tight">
            {formatINRCrores(totalSales)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Total Sales</p>
        </div>
      </div>

      <div className="w-full space-y-2 sm:w-44">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="min-w-0 flex-1 truncate font-medium">
              {entry.name}
            </span>
            <span className="shrink-0 text-muted-foreground">
              {formatCompactINR(entry.value)}
            </span>
            <span className="w-11 shrink-0 text-right tabular-nums">
              {totalSales > 0
                ? ((entry.value / totalSales) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}