'use client';

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StoreBars } from '@/components/charts/StoreBars';
import { useStoreMetrics } from '@/lib/hooks/useStoreMetrics';

export default function StoreAnalysisPage() {
  const [search, setSearch] = useState('');
  const metrics = useStoreMetrics();

  const filteredMetrics = useMemo(() => {
    if (!search) return metrics;
    return metrics.filter((m) =>
      m.storeName.toLowerCase().includes(search.toLowerCase())
    );
  }, [metrics, search]);

  return (
    <PageWrapper
      title="Store Analysis"
      description="Store-wise sales performance and distribution"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Store Rankings</CardTitle>
          <Input
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </CardHeader>
        <CardContent>
          <StoreBars data={filteredMetrics} />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
