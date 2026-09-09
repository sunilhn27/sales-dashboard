'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatINR, formatNumber } from '@/lib/utils/format';
import type { ChannelMetric } from '@/types/metrics';

function ReturnBadge({ pct }: { pct: number }) {
  const variant = pct < 5 ? 'default' : pct < 10 ? 'secondary' : 'destructive';
  const color = pct < 5 ? 'text-green-600' : pct < 10 ? 'text-amber-600' : 'text-red-600';
  return (
    <span className={color}>
      {pct.toFixed(2)}%
    </span>
  );
}

interface ChannelTableProps {
  data: ChannelMetric[];
}

export function ChannelTable({ data }: ChannelTableProps) {
  const totals = data.reduce(
    (acc, row) => ({
      salesVolume: acc.salesVolume + row.salesVolume,
      salesValue: acc.salesValue + row.salesValue,
      returnVolume: acc.returnVolume + row.returnVolume,
      returnValue: acc.returnValue + row.returnValue,
    }),
    { salesVolume: 0, salesValue: 0, returnVolume: 0, returnValue: 0 }
  );

  const totalReturnPct =
    totals.salesValue > 0
      ? (totals.returnValue / totals.salesValue) * 100
      : 0;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Channel</TableHead>
          <TableHead className="text-right">Sales (Vol)</TableHead>
          <TableHead className="text-right">Sales (Value)</TableHead>
          <TableHead className="text-right">Return (Vol)</TableHead>
          <TableHead className="text-right">Return (Value)</TableHead>
          <TableHead className="text-right">Return %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.channel}>
            <TableCell className="font-medium">{row.channel}</TableCell>
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
        <TableRow className="font-bold bg-muted/50">
          <TableCell>Total</TableCell>
          <TableCell className="text-right">
            {formatNumber(totals.salesVolume)}
          </TableCell>
          <TableCell className="text-right">
            {formatINR(totals.salesValue)}
          </TableCell>
          <TableCell className="text-right">
            {formatNumber(totals.returnVolume)}
          </TableCell>
          <TableCell className="text-right">
            {formatINR(totals.returnValue)}
          </TableCell>
          <TableCell className="text-right">
            <ReturnBadge pct={totalReturnPct} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
