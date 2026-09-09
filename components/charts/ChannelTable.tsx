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
import { formatINR, formatNumber } from '@/lib/utils/format';
import type { ChannelMetric } from '@/types/metrics';

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400',
  'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
];

function ChannelAvatar({ name, index }: { name: string; index: number }) {
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

function ReturnCell({ pct }: { pct: number }) {
  const textColor =
    pct < 5
      ? 'text-emerald-500 dark:text-emerald-400'
      : pct < 10
        ? 'text-amber-500 dark:text-amber-400'
        : 'text-red-500 dark:text-red-400';
  const barColor = pct < 5 ? 'bg-emerald-500' : pct < 10 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="flex items-center justify-end gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className={cn('h-full rounded-full', barColor)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span
        className={cn(
          'w-14 text-right text-sm font-medium tabular-nums',
          textColor
        )}
      >
        {pct.toFixed(2)}%
      </span>
    </div>
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

  const th =
    'text-xs font-medium uppercase tracking-wider text-muted-foreground';
  const num = 'text-right tabular-nums';

  return (
    <Table className="[&_th]:py-2.5 [&_td]:py-3">
      <TableHeader>
        <TableRow className="bg-slate-50/70 dark:bg-white/5">
          <TableHead className={th}>Channel</TableHead>
          <TableHead className={cn(th, num)}>Sales (Vol)</TableHead>
          <TableHead className={cn(th, num)}>Sales (Value)</TableHead>
          <TableHead className={cn(th, num)}>Return (Vol)</TableHead>
          <TableHead className={cn(th, num)}>Return (Value)</TableHead>
          <TableHead className={cn(th, num)}>Return %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={row.channel}>
            <TableCell>
              <div className="flex items-center gap-3">
                <ChannelAvatar name={row.channel} index={index} />
                <span className="font-medium">{row.channel}</span>
              </div>
            </TableCell>
            <TableCell className={num}>{formatNumber(row.salesVolume)}</TableCell>
            <TableCell className={num}>{formatINR(row.salesValue)}</TableCell>
            <TableCell className={num}>{formatNumber(row.returnVolume)}</TableCell>
            <TableCell className={num}>{formatINR(row.returnValue)}</TableCell>
            <TableCell className="text-right">
              <ReturnCell pct={row.returnPct} />
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="border-t-2 bg-slate-50/70 font-semibold dark:bg-white/5">
          <TableCell>Total</TableCell>
          <TableCell className={num}>{formatNumber(totals.salesVolume)}</TableCell>
          <TableCell className={num}>{formatINR(totals.salesValue)}</TableCell>
          <TableCell className={num}>{formatNumber(totals.returnVolume)}</TableCell>
          <TableCell className={num}>{formatINR(totals.returnValue)}</TableCell>
          <TableCell className="text-right">
            <ReturnCell pct={totalReturnPct} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}