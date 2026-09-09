'use client';

import dynamic from 'next/dynamic';
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
import { useDiscountMetrics } from '@/lib/hooks/useDiscountMetrics';
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
  const { avgDiscount, buckets } = useDiscountMetrics();

  return (
    <PageWrapper
      title="Discount Analysis"
      description="Average discount percentage and distribution"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Discount Distribution</CardTitle>
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
                <TableRow>
                  <TableHead>Range</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buckets.map((bucket) => (
                  <TableRow key={bucket.label}>
                    <TableCell className="font-medium">
                      {bucket.label}
                    </TableCell>
                    <TableCell className="text-right">
                      {bucket.count.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPct(bucket.pct)}
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
