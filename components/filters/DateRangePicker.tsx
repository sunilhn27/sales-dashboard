'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useFilterStore } from '@/lib/store/useFilterStore';

export function DateRangePicker() {
  const [open, setOpen] = useState(false);
  const { dateRange, setDateRange } = useFilterStore();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" className="w-[280px] justify-start text-left font-normal" />}>
        <CalendarIcon className="mr-2 h-4 w-4" />
        {dateRange.from && dateRange.to ? (
          <>
            {format(dateRange.from, 'MMM dd, yyyy')} -{' '}
            {format(dateRange.to, 'MMM dd, yyyy')}
          </>
        ) : (
          <span>Pick a date range</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{
            from: dateRange.from ?? undefined,
            to: dateRange.to ?? undefined,
          }}
          onSelect={(range) => {
            setDateRange(range?.from ?? null, range?.to ?? null);
            if (range?.from && range?.to) {
              setOpen(false);
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
