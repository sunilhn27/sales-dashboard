'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { MonthFilter } from '@/components/filters/MonthFilter';
import { useSalesData } from '@/lib/hooks/useSalesData';
import { getDiscountMetrics } from '@/lib/data/aggregations';
import { CHART_COLORS } from '@/lib/utils/colors';
import { formatPct } from '@/lib/utils/format';

const DiscountDonut = dynamic(
  () =>
    import('@/components/charts/DiscountDonut').then((mod) => ({
      default: mod.DiscountDonut,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 w-full" />,
  }
);

export default function DiscountAnalysisPage() {
  const rows = useSalesData();
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  const monthOptions = useMemo(() => {
    const monthMap = new Map<string, string>();
    for (const row of rows) {
      const date = new Date(row.invoiceDate);
      const value = format(date, 'yyyy-MM');
      if (!monthMap.has(value)) {
        monthMap.set(value, format(date, 'MMM yyyy'));
      }
    }
    return [...monthMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, label]) => ({ value, label }));
  }, [rows]);

  const { avgDiscount, buckets } = useMemo(() => {
    const filtered =
      selectedMonths.length === 0
        ? rows
        : rows.filter((r) =>
            selectedMonths.includes(format(new Date(r.invoiceDate), 'yyyy-MM'))
          );
    return getDiscountMetrics(filtered);
  }, [rows, selectedMonths]);

  return (
    <PageWrapper
      title="Discount Analysis"
      description="Average discount percentage and distribution"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Discount Distribution</CardTitle>
            <MonthFilter
              options={monthOptions}
              selected={selectedMonths}
              onChange={setSelectedMonths}
            />
          </CardHeader>
          <CardContent>
            <DiscountDonut buckets={buckets} avgDiscount={avgDiscount} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discount Buckets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70 dark:bg-white/5">
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Range
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Count
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Share
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buckets.map((bucket, index) => (
                  <TableRow key={bucket.label}>
                    <TableCell>
                      <span className="flex items-center gap-2.5 font-medium">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              CHART_COLORS[index % CHART_COLORS.length],
                          }}
                        />
                        {bucket.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {bucket.count.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(bucket.pct, 100)}%`,
                              backgroundColor:
                                CHART_COLORS[index % CHART_COLORS.length],
                            }}
                          />
                        </div>
                        <span className="w-14 text-right text-sm tabular-nums">
                          {formatPct(bucket.pct)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
