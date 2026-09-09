'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { FileUploader } from '@/components/upload/FileUploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useDataStore } from '@/lib/store/useDataStore';
import { useSalesData } from '@/lib/hooks/useSalesData';
import { formatINR, formatNumber, formatPct } from '@/lib/utils/format';
import {
  DollarSign,
  ShoppingCart,
  RotateCcw,
  TrendingDown,
  Percent,
} from 'lucide-react';

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

const CategoryStackedBar = dynamic(
  () =>
    import('@/components/charts/CategoryStackedBar').then((mod) => ({
      default: mod.CategoryStackedBar,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 w-full" />,
  }
);

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

const TrendLineChart = dynamic(
  () =>
    import('@/components/charts/TrendLineChart').then((mod) => ({
      default: mod.TrendLineChart,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 w-full" />,
  }
);

export default function DashboardPage() {
  const { isLoaded } = useDataStore();
  const rows = useSalesData();

  const kpis = useMemo(() => {
    const salesRows = rows.filter((r) => r.transactionType === 'IV');
    const returnRows = rows.filter(
      (r) => r.transactionType === 'SR' || r.transactionType === 'IR'
    );

    const totalSalesValue = salesRows.reduce((s, r) => s + r.value, 0);
    const totalSalesVolume = salesRows.reduce(
      (s, r) => s + r.totalSalesQty,
      0
    );
    const totalReturnValue = returnRows.reduce(
      (s, r) => s + Math.abs(r.value),
      0
    );
    const totalReturnVolume = returnRows.reduce(
      (s, r) => s + Math.abs(r.totalSalesQty),
      0
    );
    const returnPct =
      totalSalesValue > 0 ? (totalReturnValue / totalSalesValue) * 100 : 0;

    return {
      totalSalesValue,
      totalSalesVolume,
      totalReturnValue,
      totalReturnVolume,
      returnPct,
    };
  }, [rows]);

  if (!isLoaded) {
    return (
      <PageWrapper
        title="Dashboard"
        description="Upload your sales data to get started"
      >
        <FileUploader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Dashboard"
      description="Overview of your sales performance"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          title="Total Sales Value"
          value={formatINR(kpis.totalSalesValue)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KpiCard
          title="Total Sales Volume"
          value={formatNumber(kpis.totalSalesVolume)}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <KpiCard
          title="Total Return Value"
          value={formatINR(kpis.totalReturnValue)}
          icon={<RotateCcw className="h-4 w-4" />}
        />
        <KpiCard
          title="Total Return Volume"
          value={formatNumber(kpis.totalReturnVolume)}
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <KpiCard
          title="Return %"
          value={formatPct(kpis.returnPct)}
          icon={<Percent className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Brand Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <BrandBarChart data={useMemo(() => [], [])} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryStackedBar data={useMemo(() => [], [])} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Discount Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <DiscountDonut buckets={useMemo(() => [], [])} avgDiscount={0} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily">
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              <TabsContent value="daily">
                <TrendLineChart data={rows} period="daily" />
              </TabsContent>
              <TabsContent value="weekly">
                <TrendLineChart data={rows} period="weekly" />
              </TabsContent>
              <TabsContent value="monthly">
                <TrendLineChart data={rows} period="monthly" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
