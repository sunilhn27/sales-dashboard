'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  Store,
  Tag,
  Percent,
  ShoppingCart,
  RotateCcw,
  LayoutDashboard,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDataStore } from '@/lib/store/useDataStore';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/brand-analysis', label: 'Brand Analysis', icon: BarChart3 },
  { href: '/channel-analysis', label: 'Channel Analysis', icon: TrendingUp },
  { href: '/category-analysis', label: 'Category Analysis', icon: Tag },
  { href: '/store-analysis', label: 'Store Analysis', icon: Store },
  { href: '/discount-analysis', label: 'Discount Analysis', icon: Percent },
  { href: '/returns-analysis', label: 'Returns Analysis', icon: RotateCcw },
];

export function Sidebar() {
  const pathname = usePathname();
  const { fileName, isLoaded } = useDataStore();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r border-border bg-card">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <ShoppingCart className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">Sales Analytics</span>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="px-4 py-3">
        {isLoaded ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              ✓
            </Badge>
            <span className="text-xs text-muted-foreground truncate">
              {fileName}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">
            No data loaded
          </span>
        )}
      </div>
    </aside>
  );
}
