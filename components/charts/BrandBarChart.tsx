'use client';

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import type { BrandMetric } from '@/types/metrics';

const chartConfig = {
  salesVolume: { label: 'Sales Volume', color: 'var(--chart-1)' },
  returnVolume: { label: 'Return Volume', color: 'var(--chart-2)' },
} satisfies ChartConfig;

interface BrandBarChartProps {
  data: BrandMetric[];
  showValue?: boolean;
}

export function BrandBarChart({ data, showValue = false }: BrandBarChartProps) {
  const dataKey = showValue ? 'salesValue' : 'salesVolume';
  const returnKey = showValue ? 'returnValue' : 'returnVolume';

  const config = showValue
    ? {
        salesValue: { label: 'Sales Value', color: 'var(--chart-1)' },
        returnValue: { label: 'Return Value', color: 'var(--chart-2)' },
      }
    : chartConfig;

  return (
    <ChartContainer config={config} className="h-80 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="brandName" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey={dataKey} fill="var(--color-salesVolume)" radius={4} />
        <Bar dataKey={returnKey} fill="var(--color-returnVolume)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
