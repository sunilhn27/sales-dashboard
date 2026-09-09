'use client';

import { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
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

const MAX_CATEGORIES = 8;

interface CategoryStackedBarProps {
  data: CategoryMetric[];
  showValue?: boolean;
}

export function CategoryStackedBar({
  data,
  showValue = false,
}: CategoryStackedBarProps) {
  const { chartData, chartConfig, barKeys, categoryColors } = useMemo(() => {
    // Rank categories globally by sales value so the chart stays readable
    const catTotals = new Map<string, number>();
    for (const item of data) {
      catTotals.set(
        item.category,
        (catTotals.get(item.category) ?? 0) + item.salesValue
      );
    }
    const ranked = [...catTotals.entries()].sort((a, b) => b[1] - a[1]);
    const top = ranked.slice(0, MAX_CATEGORIES).map(([cat]) => cat);
    const hasOthers = ranked.length > MAX_CATEGORIES;

    // Per-brand accumulation; extra categories roll into "Others"
    const brandMap = new Map<string, Record<string, number>>();
    for (const item of data) {
      if (!brandMap.has(item.brandName)) {
        brandMap.set(item.brandName, {});
      }
      const brand = brandMap.get(item.brandName)!;
      const value = showValue ? item.salesValue : item.salesVolume;
      const key = top.includes(item.category) ? item.category : 'Others';
      brand[key] = (brand[key] ?? 0) + value;
    }
    const chartData = [...brandMap.entries()].map(([brandName, values]) => ({
      brandName,
      ...values,
    }));

    const barKeys = [...top];
    if (hasOthers) {
      barKeys.push('Others');
    }

    const config: ChartConfig = {};
    const categoryColors: Record<string, string> = {};
    barKeys.forEach((cat, i) => {
      const color = CHART_COLORS[i % CHART_COLORS.length];
      config[cat] = { label: cat, color };
      categoryColors[cat] = color;
    });

    return { chartData, chartConfig: config, barKeys, categoryColors };
  }, [data, showValue]);

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 12 }}>
        {/* stroke #ccc lets the shadcn chart theme (light/dark border) color the grid */}
        <CartesianGrid
          vertical={false}
          stroke="#ccc"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="brandName"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          tickMargin={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          tickMargin={8}
          width={64}
          tickCount={6}
          tickFormatter={(value: number) => {
            const v = Number(value);
            if (showValue) {
              // value mode — the sheet's Value column is already in crores
              if (Math.abs(v) >= 1) return `${v.toFixed(0)} Cr`;
              return `${(v * 100).toFixed(0)} L`;
            }
            // volume mode — plain unit counts
            if (Math.abs(v) >= 1e5) return `${(v / 1e5).toFixed(1)} L`;
            if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(0)}k`;
            return String(Math.round(v));
          }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {barKeys.map((cat, i) => (
          <Bar
            key={cat}
            dataKey={cat}
            stackId="categories"
            fill={categoryColors[cat]}
            maxBarSize={56}
            radius={
              i === barKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
            }
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}