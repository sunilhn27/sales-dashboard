import { create } from 'zustand';

interface FilterStore {
  dateRange: { from: Date | null; to: Date | null };
  brands: string[];
  channels: string[];
  quarters: string[];
  setDateRange: (from: Date | null, to: Date | null) => void;
  setBrands: (brands: string[]) => void;
  setChannels: (channels: string[]) => void;
  setQuarters: (quarters: string[]) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  dateRange: { from: null, to: null },
  brands: [],
  channels: [],
  quarters: [],
  setDateRange: (from, to) => set({ dateRange: { from, to } }),
  setBrands: (brands) => set({ brands }),
  setChannels: (channels) => set({ channels }),
  setQuarters: (quarters) => set({ quarters }),
  reset: () =>
    set({
      dateRange: { from: null, to: null },
      brands: [],
      channels: [],
      quarters: [],
    }),
}));
