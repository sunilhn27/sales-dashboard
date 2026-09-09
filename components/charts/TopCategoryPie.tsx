'use client';

import { useMemo } from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { CHART_COLORS } from '@/lib/utils/colors';
import type { CategoryMetric } from '@/types/metrics';

interface TopCategoryPieProps {
  data: CategoryMetric[];
  topN?: number;
}

export function TopCategoryPie({ data, topN = 5 }: TopCategoryPieProps) {
  const { chartData, chartConfig } = useMemo(() => {
    const categoryMap = new Map<string, number>();

    for (const item of data) {
      const current = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, current + item.salesValue);
    }

    const sorted = [...categoryMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN);

    const config: ChartConfig = {};
    const chartData = sorted.map(([category, value], index) => {
      config[category] = {
        label: category,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
      return {
        category,
        value,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      };
    });

    return { chartData, chartConfig: config };
  }, [data, topN]);

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          paddingAngle={2}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  );
}
