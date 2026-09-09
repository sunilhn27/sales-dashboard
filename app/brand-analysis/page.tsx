'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useBrandMetrics } from '@/lib/hooks/useBrandMetrics';
import { formatINR, formatNumber, formatPct } from '@/lib/utils/format';

const BrandBarChart = dynamic(
  () =>
    import('@/components/charts/BrandBarChart').then((mod) => ({
      default: mod.BrandBarChart,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 w-full" />,
  }
);

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

export default function BrandAnalysisPage() {
  const [showValue, setShowValue] = useState(false);
  const metrics = useBrandMetrics();

  return (
    <PageWrapper
      title="Brand Analysis"
      description="Brand-wise sales and returns performance"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Brand Performance</CardTitle>
          <Tabs
            value={showValue ? 'value' : 'volume'}
            onValueChange={(v) => setShowValue(v === 'value')}
          >
            <TabsList>
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="value">Value</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <BrandBarChart data={metrics} showValue={showValue} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 dark:bg-white/5">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                  Brand
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                  Sales Vol
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                  Sales Value
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                  Return Vol
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                  Return Value
                </TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                  Return %
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((row) => (
                <TableRow key={row.brandCode}>
                  <TableCell className="font-medium">
                    {row.brandName}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(row.salesVolume)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatINR(row.salesValue)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(row.returnVolume)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatINR(row.returnValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ReturnBadge pct={row.returnPct} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
