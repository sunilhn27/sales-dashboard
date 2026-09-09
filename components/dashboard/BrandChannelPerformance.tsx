'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardCard, getSpanClass } from '@/components/dashboard/DashboardCard';
import { cn } from '@/lib/utils';
import { useDashboardLayout } from '@/lib/store/useDashboardLayout';
import { useBrandChannelMetrics } from '@/lib/hooks/useBrandChannelMetrics';
import { formatINRCrores, formatNumber } from '@/lib/utils/format';

const MAX_ROWS = 10;

const chartConfig = {
  sales: { label: 'Gross sold', color: 'var(--chart-1)' },
  returns: { label: 'Returned', color: 'var(--chart-2)' },
} satisfies ChartConfig;

function shortLabel(brandName: string, channel: string) {
  const brand = brandName
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
  const ch = channel
    .split(/\s+/)[0]
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());
  return `${brand} - ${ch}`;
}

function ReturnBadge({ pct }: { pct: number }) {
  const style =
    pct < 5
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
      : pct < 10
        ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
        : 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        style
      )}
    >
      {pct.toFixed(2)}%
    </span>
  );
}

export function BrandChannelPerformance() {
  const metrics = useBrandChannelMetrics();
  const { spans } = useDashboardLayout();
  const [showValue, setShowValue] = useState(true);

  const span = spans['brand-channel'] ?? 3;

  const rows = useMemo(() => metrics.slice(0, MAX_ROWS), [metrics]);

  const chartData = useMemo(
    () =>
      rows.map((m) => ({
        label: shortLabel(m.brandName, m.channel),
        sales: showValue ? m.salesValue : m.salesVolume,
        returns: showValue ? m.returnValue : m.returnVolume,
      })),
    [rows, showValue]
  );

  const formatAxis = (value: number) => {
    const v = Number(value);
    if (showValue) {
      if (Math.abs(v) >= 1) return `${v.toFixed(0)} Cr`;
      return `${(v * 100).toFixed(0)} L`;
    }
    if (Math.abs(v) >= 1e5) return `${(v / 1e5).toFixed(1)} L`;
    if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(0)}k`;
    return String(Math.round(v));
  };

  const formatCell = (v: number) =>
    showValue ? formatINRCrores(v) : formatNumber(v);

  return (
    <Tabs
      className={cn(getSpanClass(span), 'w-full')}
      value={showValue ? 'value' : 'volume'}
      onValueChange={(v) => setShowValue(v === 'value')}
    >
      <DashboardCard
        id="brand-channel"
        title="Sales & Returns by Brand & Channel"
        description="Gross sold vs returned, broken down by brand and channel"
        defaultSpan={3}
        resizable
        headerAction={
          <TabsList>
            <TabsTrigger value="value">Value</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
          </TabsList>
        }
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartContainer config={chartConfig} className="h-96 w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickMargin={8}
                tickFormatter={formatAxis}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={104}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="sales"
                fill="var(--color-sales)"
                radius={[0, 4, 4, 0]}
                barSize={14}
              />
              <Bar
                dataKey="returns"
                fill="var(--color-returns)"
                radius={[0, 4, 4, 0]}
                barSize={14}
              />
            </BarChart>
          </ChartContainer>

          <Table className="[&_th]:py-2.5 [&_td]:py-3">
            <TableHeader>
              <TableRow className="bg-slate-50/70 dark:bg-white/5">
                <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Brand / Channel
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Gross
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Returned
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Return %
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((m) => (
                <TableRow key={`${m.brandName}-${m.channel}`}>
                  <TableCell>
                    <span className="block font-medium">{m.brandName}</span>
                    <span className="block text-xs text-muted-foreground">
                      {m.channel}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCell(showValue ? m.salesValue : m.salesVolume)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCell(showValue ? m.returnValue : m.returnVolume)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ReturnBadge pct={m.returnPct} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DashboardCard>
    </Tabs>
  );
}