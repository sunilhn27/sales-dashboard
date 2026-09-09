'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { ExportButton } from '@/components/export/ExportButton';
import { useDataStore } from '@/lib/store/useDataStore';

export function Header() {
  const { isLoaded } = useDataStore();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card lg:px-8">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold">Sales Analytics Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        {isLoaded && <ExportButton />}
      </div>
    </header>
  );
}
