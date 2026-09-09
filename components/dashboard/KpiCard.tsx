import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Accent = 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'pink';

const accentStyles: Record<Accent, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  green:
    'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  orange:
    'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400',
  purple:
    'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
  pink: 'bg-pink-50 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400',
};

interface KpiCardProps {
  title: string;
  value: string;
  description?: string;
  icon: ReactNode;
  accent?: Accent;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onDelete?: () => void;
}

export function KpiCard({
  title,
  value,
  description,
  icon,
  accent = 'blue',
  trend,
  trendValue,
  onDelete,
}: KpiCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight truncate">
            {value}
          </p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
          {trend && trendValue && (
            <p
              className={cn(
                'mt-1.5 flex items-center gap-1 text-xs font-medium',
                trend === 'up' && 'text-emerald-600',
                trend === 'down' && 'text-red-600',
                trend === 'neutral' && 'text-muted-foreground'
              )}
            >
              <span
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-full',
                  trend === 'up' && 'bg-emerald-100 dark:bg-emerald-500/20',
                  trend === 'down' && 'bg-red-100 dark:bg-red-500/20',
                  trend === 'neutral' && 'bg-muted'
                )}
              >
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              </span>
              {trendValue}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {onDelete && (
            <button
              type="button"
              title="Delete card"
              aria-label={`Delete ${title}`}
              onClick={onDelete}
              className="rounded-md p-1 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              accentStyles[accent]
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}