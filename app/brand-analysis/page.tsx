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
  const color = pct < 5 ? 'text-green-600' : pct < 10 ? 'text-amber-600' : 'text-red-600';
  return (
    <span className={color}>
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
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead className="text-right">Sales Vol</TableHead>
                <TableHead className="text-right">Sales Value</TableHead>
                <TableHead className="text-right">Return Vol</TableHead>
                <TableHead className="text-right">Return Value</TableHead>
                <TableHead className="text-right">Return %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((row) => (
                <TableRow key={row.brandCode}>
                  <TableCell className="font-medium">
                    {row.brandName}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(row.salesVolume)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatINR(row.salesValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(row.returnVolume)}
                  </TableCell>
                  <TableCell className="text-right">
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
