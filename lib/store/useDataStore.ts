import { create } from 'zustand';
import type { SalesRow } from '@/types/sales';

interface DataStore {
  rows: SalesRow[];
  isLoaded: boolean;
  fileName: string | null;
  setRows: (rows: SalesRow[], fileName: string) => void;
  reset: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
  rows: [],
  isLoaded: false,
  fileName: null,
  setRows: (rows, fileName) => set({ rows, isLoaded: true, fileName }),
  reset: () => set({ rows: [], isLoaded: false, fileName: null }),
}));
