'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface MonthOption {
  value: string; // yyyy-MM
  label: string; // e.g. "Sep 2025"
}

interface MonthFilterProps {
  options: MonthOption[];
  selected: string[];
  onChange: (months: string[]) => void;
}

export function MonthFilter({ options, selected, onChange }: MonthFilterProps) {
  const toggleMonth = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className="w-[200px] justify-between" />}>
        {selected.length === 0
          ? 'All Months'
          : `${selected.length} month${selected.length > 1 ? 's' : ''} selected`}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search months..." />
          <CommandList>
            <CommandEmpty>No months found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => toggleMonth(option.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.includes(option.value) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}