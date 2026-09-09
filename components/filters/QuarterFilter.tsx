'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFilterStore } from '@/lib/store/useFilterStore';

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

export function QuarterFilter() {
  const { quarters: selectedQuarters, setQuarters } = useFilterStore();

  const toggleQuarter = (quarter: string) => {
    if (selectedQuarters.includes(quarter)) {
      setQuarters(selectedQuarters.filter((q) => q !== quarter));
    } else {
      setQuarters([...selectedQuarters, quarter]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {quarters.map((quarter) => (
        <Button
          key={quarter}
          variant={selectedQuarters.includes(quarter) ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleQuarter(quarter)}
          className={cn(
            'w-12',
            selectedQuarters.includes(quarter) && 'bg-primary text-primary-foreground'
          )}
        >
          {quarter}
        </Button>
      ))}
    </div>
  );
}
