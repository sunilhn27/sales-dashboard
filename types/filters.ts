export interface FilterState {
  dateRange: { from: Date | null; to: Date | null };
  brands: string[];
  channels: string[];
  quarters: string[];
}
