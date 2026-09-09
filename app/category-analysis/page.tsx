'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { BrandFilter } from '@/components/filters/BrandFilter';
import { ChannelFilter } from '@/components/filters/ChannelFilter';
import { QuarterFilter } from '@/components/filters/QuarterFilter';
import { useCategoryMetrics } from '@/lib/hooks/useCategoryMetrics';

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

export default function CategoryAnalysisPage() {
  const [showValue, setShowValue] = useState(false);
  const metrics = useCategoryMetrics();

  return (
    <PageWrapper
      title="Category Analysis"
      description="Brand-wise category sales distribution"
    >
      <div className="flex flex-wrap items-center gap-3">
        <BrandFilter />
        <ChannelFilter />
        <QuarterFilter />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Category Distribution</CardTitle>
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
          <CategoryStackedBar data={metrics} showValue={showValue} />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
