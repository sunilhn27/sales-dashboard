export const DASHBOARD_CARDS = [
  { id: 'kpi-sales-value', title: 'Total Sales Value' },
  { id: 'kpi-sales-volume', title: 'Total Sales Volume' },
  { id: 'kpi-return-value', title: 'Total Return Value' },
  { id: 'kpi-return-volume', title: 'Total Return Volume' },
  { id: 'kpi-return-pct', title: 'Return %' },
  { id: 'brand-channel', title: 'Sales & Returns by Brand & Channel' },
  { id: 'brand', title: 'Brand Performance' },
  { id: 'category', title: 'Category Distribution' },
  { id: 'insights', title: 'Key Insights' },
  { id: 'discount', title: 'Discount Distribution' },
  { id: 'top-categories', title: 'Top Categories by Sales Value' },
  { id: 'store', title: 'Store Wise Sales' },
  { id: 'location', title: 'Location Wise Sales' },
  { id: 'trend', title: 'Sales Trend' },
] as const;

export type DashboardCardId = (typeof DASHBOARD_CARDS)[number]['id'];