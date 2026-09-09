'use client';

import { useMemo } from 'react';
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
import { useDataStore } from '@/lib/store/useDataStore';
import { useFilterStore } from '@/lib/store/useFilterStore';

export function BrandFilter() {
  const { rows } = useDataStore();
  const { brands, setBrands } = useFilterStore();

  const uniqueBrands = useMemo(() => {
    const brandMap = new Map<string, string>();
    for (const row of rows) {
      if (!brandMap.has(row.brandCode)) {
        brandMap.set(row.brandCode, row.brandName);
      }
    }
    return [...brandMap.entries()].map(([code, name]) => ({
      code,
      name,
    }));
  }, [rows]);

  const toggleBrand = (code: string) => {
    if (brands.includes(code)) {
      setBrands(brands.filter((b) => b !== code));
    } else {
      setBrands([...brands, code]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className="w-[200px] justify-between" />}>
        {brands.length === 0 ? 'All Brands' : `${brands.length} selected`}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search brands..." />
          <CommandList>
            <CommandEmpty>No brands found.</CommandEmpty>
            <CommandGroup>
              {uniqueBrands.map((brand) => (
                <CommandItem
                  key={brand.code}
                  value={brand.code}
                  onSelect={() => toggleBrand(brand.code)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      brands.includes(brand.code) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {brand.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
