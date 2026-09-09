'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { KeyInsights } from '@/components/dashboard/KeyInsights';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { FileUploader } from '@/components/upload/FileUploader';
import { Skeleton } from '@/components/ui/skeleton';
import { StoreBars } from '@/components/charts/StoreBars';
import { LocationTable } from '@/components/charts/LocationTable';
import { useDataStore } from '@/lib/store/useDataStore';
import { useSalesData } from '@/lib/hooks/useSalesData';
import { useBrandMetrics } from '@/lib/hooks/useBrandMetrics';
import { useCategoryMetrics } from '@/lib/hooks/useCategoryMetrics';
import { useDiscountMetrics } from '@/lib/hooks/useDiscountMetrics';
import { useStoreMetrics } from '@/lib/hooks/useStoreMetrics';
import { useLocationMetrics } from '@/lib/hooks/useLocationMetrics';
import { useDashboardLayout } from '@/lib/store/useDashboardLayout';
import { formatINRCrores, formatNumber, formatPct } from '@/lib/utils/format';
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

const BrandChannelPerformance = dynamic(
  () =>
    import('@/components/dashboard/BrandChannelPerformance').then((mod) => ({
      default: mod.BrandChannelPerformance,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

const SalesReturnTrend = dynamic(
  () =>
    import('@/components/dashboard/SalesReturnTrend').then((mod) => ({
      default: mod.SalesReturnTrend,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />,
  }
);

const TopCategoryPie = dynamic(
  () =>
    import('@/components/charts/TopCategoryPie').then((mod) => ({
      default: mod.TopCategoryPie,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 w-full" />,
  }
);

export default function DashboardPage() {
  const { isLoaded } = useDataStore();
  const rows = useSalesData();
  const brandMetrics = useBrandMetrics();
  const categoryMetrics = useCategoryMetrics();
  const storeMetrics = useStoreMetrics();
  const locationMetrics = useLocationMetrics();
  const { avgDiscount, buckets } = useDiscountMetrics();
  const { hideCard, order } = useDashboardLayout();

  const topStores = storeMetrics.slice(0, 8);

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
          value={formatINRCrores(kpis.totalSalesValue)}
          icon={<DollarSign className="h-4 w-4" />}
          accent="blue"
          onDelete={() => hideCard('kpi-sales-value')}
        />
        <KpiCard
          title="Total Sales Volume"
          value={formatNumber(kpis.totalSalesVolume)}
          icon={<ShoppingCart className="h-4 w-4" />}
          accent="purple"
          onDelete={() => hideCard('kpi-sales-volume')}
        />
        <KpiCard
          title="Total Return Value"
          value={formatINRCrores(kpis.totalReturnValue)}
          icon={<RotateCcw className="h-4 w-4" />}
          accent="orange"
          onDelete={() => hideCard('kpi-return-value')}
        />
        <KpiCard
          title="Total Return Volume"
          value={formatNumber(kpis.totalReturnVolume)}
          icon={<TrendingDown className="h-4 w-4" />}
          accent="red"
          onDelete={() => hideCard('kpi-return-volume')}
        />
        <KpiCard
          title="Return %"
          value={formatPct(kpis.returnPct)}
          icon={<Percent className="h-4 w-4" />}
          accent="green"
          onDelete={() => hideCard('kpi-return-pct')}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {order.map((id) => {
          switch (id) {
            case 'brand-channel':
              return <BrandChannelPerformance key={id} />;
            case 'brand':
              return (
                <DashboardCard key={id} id="brand" title="Brand Performance" resizable>
                  <BrandBarChart data={brandMetrics} />
                </DashboardCard>
              );
            case 'category':
              return (
                <DashboardCard key={id} id="category" title="Category Distribution" resizable>
                  <CategoryStackedBar data={categoryMetrics} />
                </DashboardCard>
              );
            case 'insights':
              return (
                <DashboardCard key={id} id="insights" title="Key Insights">
                  <KeyInsights />
                </DashboardCard>
              );
            case 'discount':
              return (
                <DashboardCard key={id} id="discount" title="Discount Distribution" resizable>
                  <DiscountDonut buckets={buckets} avgDiscount={avgDiscount} />
                </DashboardCard>
              );
            case 'top-categories':
              return (
                <DashboardCard
                  key={id}
                  id="top-categories"
                  title="Top Categories by Sales Value"
                  resizable
                >
                  <TopCategoryPie />
                </DashboardCard>
              );
            case 'store':
              return (
                <DashboardCard
                  key={id}
                  id="store"
                  title="Store Wise Sales"
                  description="Top stores by sales value"
                  defaultSpan={2}
                  resizable
                >
                  <StoreBars data={topStores} />
                </DashboardCard>
              );
            case 'location':
              return (
                <DashboardCard
                  key={id}
                  id="location"
                  title="Location Wise Sales"
                  description="Sales by fulfilment region"
                  resizable
                >
                  <LocationTable data={locationMetrics} />
                </DashboardCard>
              );
            case 'trend':
              return <SalesReturnTrend key={id} data={rows} className="h-96" />;
            default:
              return null;
          }
        })}
      </div>
    </PageWrapper>
  );
}