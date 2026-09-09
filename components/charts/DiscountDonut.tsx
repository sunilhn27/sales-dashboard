'use client';

import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { CHART_COLORS } from '@/lib/utils/colors';
import type { DiscountBucket } from '@/types/metrics';

interface DiscountDonutProps {
  buckets: DiscountBucket[];
  avgDiscount: number;
}

export function DiscountDonut({ buckets, avgDiscount }: DiscountDonutProps) {
  const chartConfig = buckets.reduce((acc, bucket, i) => {
    acc[bucket.label] = {
      label: bucket.label,
      color: CHART_COLORS[i % CHART_COLORS.length],
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="relative">
      <ChartContainer config={chartConfig} className="h-80 w-full">
        <PieChart>
          <Pie
            data={buckets}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          >
            {buckets.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ChartContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-2xl font-bold">{avgDiscount.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Avg Discount</p>
        </div>
      </div>
    </div>
  );
}
