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

export function ChannelFilter() {
  const { rows } = useDataStore();
  const { channels, setChannels } = useFilterStore();

  const uniqueChannels = useMemo(() => {
    const channelSet = new Set<string>();
    for (const row of rows) {
      channelSet.add(row.channel);
    }
    return [...channelSet].sort();
  }, [rows]);

  const toggleChannel = (channel: string) => {
    if (channels.includes(channel)) {
      setChannels(channels.filter((c) => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className="w-[200px] justify-between" />}>
        {channels.length === 0 ? 'All Channels' : `${channels.length} selected`}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search channels..." />
          <CommandList>
            <CommandEmpty>No channels found.</CommandEmpty>
            <CommandGroup>
              {uniqueChannels.map((channel) => (
                <CommandItem
                  key={channel}
                  value={channel}
                  onSelect={() => toggleChannel(channel)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      channels.includes(channel) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {channel}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
