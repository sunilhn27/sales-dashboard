'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChannelTable } from '@/components/charts/ChannelTable';
import { useChannelMetrics } from '@/lib/hooks/useChannelMetrics';

export default function ChannelAnalysisPage() {
  const metrics = useChannelMetrics();

  return (
    <PageWrapper
      title="Channel Analysis"
      description="Channel-wise sales and returns breakdown"
    >
      <Card>
        <CardHeader>
          <CardTitle>Channel Performance</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <ChannelTable data={metrics} />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
