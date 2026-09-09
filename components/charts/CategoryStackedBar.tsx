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
import type { CategoryMetric } from '@/types/metrics';

const chartConfig = {
  CKU: { label: 'Men', color: 'var(--chart-1)' },
  CKW: { label: 'Women', color: 'var(--chart-2)' },
  CKK: { label: 'Kids', color: 'var(--chart-3)' },
  CKA: { label: 'Accessories', color: 'var(--chart-4)' },
} satisfies ChartConfig;

interface CategoryStackedBarProps {
  data: CategoryMetric[];
  showValue?: boolean;
}

export function CategoryStackedBar({
  data,
  showValue = false,
}: CategoryStackedBarProps) {
  const brandMap = new Map<string, { brandName: string; [key: string]: string | number }>();

  for (const item of data) {
    if (!brandMap.has(item.brandName)) {
      brandMap.set(item.brandName, { brandName: item.brandName });
    }
    const brand = brandMap.get(item.brandName)!;
    brand[item.category] = showValue ? item.salesValue : item.salesVolume;
  }

  const chartData = [...brandMap.values()];

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="brandName" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="CKU"
          stackId="categories"
          fill="var(--color-CKU)"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="CKW"
          stackId="categories"
          fill="var(--color-CKW)"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="CKK"
          stackId="categories"
          fill="var(--color-CKK)"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="CKA"
          stackId="categories"
          fill="var(--color-CKA)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
