'use client';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DASHBOARD_CARDS } from '@/lib/dashboardCards';
import { useDashboardLayout } from '@/lib/store/useDashboardLayout';

export default function DeleteTablesPage() {
  const { hidden, hideCard, restoreCard, restoreAll } = useDashboardLayout();

  const hiddenCount = DASHBOARD_CARDS.filter((c) => hidden[c.id]).length;

  return (
    <PageWrapper
      title="Delete Tables"
      description="Choose which dashboard tables are shown. Deleted tables can be restored here."
    >
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dashboard Tables</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={restoreAll}
            disabled={hiddenCount === 0}
          >
            Restore All
          </Button>
        </CardHeader>
        <CardContent>
          <Table className="[&_td]:py-3">
            <TableHeader>
              <TableRow className="bg-slate-50/70 dark:bg-white/5">
                <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Table
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DASHBOARD_CARDS.map((card) => {
                const isHidden = !!hidden[card.id];
                return (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">{card.title}</TableCell>
                    <TableCell>
                      {isHidden ? (
                        <Badge variant="secondary">Deleted</Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-emerald-600 dark:text-emerald-400"
                        >
                          Visible
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isHidden ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => restoreCard(card.id)}
                        >
                          Restore
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => hideCard(card.id)}
                          className="text-red-600 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400"
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}