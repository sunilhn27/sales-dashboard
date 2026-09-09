'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatINR, formatNumber, formatPct } from '@/lib/utils/format';
import type { LocationMetric } from '@/types/metrics';

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400',
];

function LocationAvatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
        AVATAR_COLORS[index % AVATAR_COLORS.length]
      )}
    >
      {initials || '?'}
    </span>
  );
}

interface LocationTableProps {
  data: LocationMetric[];
}

export function LocationTable({ data }: LocationTableProps) {
  const totals = data.reduce(
    (acc, row) => ({
      salesVolume: acc.salesVolume + row.salesVolume,
      salesValue: acc.salesValue + row.salesValue,
    }),
    { salesVolume: 0, salesValue: 0 }
  );

  const th = 'text-xs font-medium uppercase tracking-wider text-muted-foreground';
  const num = 'text-right tabular-nums';

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/70 dark:bg-white/5">
          <TableHead className={th}>Region</TableHead>
          <TableHead className={cn(th, num)}>Sales (Vol)</TableHead>
          <TableHead className={cn(th, num)}>Sales (Value)</TableHead>
          <TableHead className={cn(th, num)}>Share</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={row.location}>
            <TableCell>
              <div className="flex items-center gap-3">
                <LocationAvatar name={row.location} index={index} />
                <span className="font-medium">{row.location}</span>
              </div>
            </TableCell>
            <TableCell className={num}>{formatNumber(row.salesVolume)}</TableCell>
            <TableCell className={num}>{formatINR(row.salesValue)}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(row.sharePct, 100)}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm tabular-nums">
                  {formatPct(row.sharePct)}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="border-t-2 bg-slate-50/70 font-semibold dark:bg-white/5">
          <TableCell>Total</TableCell>
          <TableCell className={num}>{formatNumber(totals.salesVolume)}</TableCell>
          <TableCell className={num}>{formatINR(totals.salesValue)}</TableCell>
          <TableCell className="text-right text-sm">100%</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}