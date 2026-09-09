# Sales Analytics — Build Guide

> **Stack**: Next.js 16.3 · React 19 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui · App Router

---

## 1. Excel Data Schema

Based on `Sales_data.xlsx` (first 50 rows sampled), the columns are:

| # | Column Name | Type | Description |
|---|-------------|------|-------------|
| 1 | `Channel` | string | Sales channel (e.g. `MYNTRA DIRECT`) |
| 2 | `Store code` | number | Numeric store identifier |
| 3 | `Store name` | string | Human-readable store name |
| 4 | `Seller name` | string | Seller / distributor name |
| 5 | `Sales Transaction Type (IV/SR/IR)` | string | `IV` = Invoice (Sale), `SR` = Sales Return, `IR` = Internal Return |
| 6 | `Invoice No` | string | Invoice reference number |
| 7 | `Invoice Date` | date | Transaction date (YYYY-MM-DD) |
| 8 | `Ecom Order No.` | string | E-commerce platform order ID |
| 9 | `Brand Code` | string | Short brand identifier (e.g. `CK`) |
| 10 | `Brand Name` | string | Full brand name (e.g. `Calvin Klein`) |
| 11 | `Barcode` | number | Product barcode / SKU |
| 12 | `Total Sales Qty` | number | Units sold (negative for returns) |
| 13 | `Unit MRP` | number | Maximum retail price per unit |
| 14 | `Invoice MRP Value` | number | Gross MRP value on invoice |
| 15 | `Invoice Discount Value` | number | Total discount applied |
| 16 | `Discount %` | number | Discount as decimal (e.g. `0.1458` = 14.58%) |
| 17 | `Nett Invoice Value` | number | Net value after discount |
| 18 | `Value` | number | Final settled value (in Cr when aggregated) |
| 19 | `Status` | string | `Sales` or `Return` |
| 20 | `Quarter` | string | Financial quarter (e.g. `Q1`) |
| 21 | `Final Category` | string | Product category code (e.g. `CKU`) |
| 22 | `Fulfilment Region` | string | Dispatch region |
| 23 | `Fulfilment Cluster` | string | Dispatch cluster |
| 24 | `Fulfilment State` | string | Dispatch state |
| 25 | `Fulfilment City` | string | Dispatch city |
| 26 | `Ordering Region` | string | Order origin region |
| 27 | `Ordering State` | string | Order origin state |
| 28 | `Ordering City` | string | Order origin city |

### Key Derived Fields (computed in the data layer)

```ts
// Sales vs Return split
const isSale   = row.transactionType === 'IV';
const isReturn = row.transactionType === 'SR' || row.transactionType === 'IR';

// Return %
const returnPct = (totalReturnValue / totalSalesValue) * 100;

// Average discount %
const avgDiscount = (totalDiscountValue / totalMRPValue) * 100;
```

---

## 2. Project Setup

This project already has Next.js 16 initialised. Run the following to install all new dependencies:

```bash
# ── Step 1: shadcn/ui initialisation (generates components/ui/ + lib/utils.ts)
npx shadcn@latest init
# Prompts: style = Default, base color = Slate, CSS variables = yes

# ── Step 2: Add all required shadcn components
npx shadcn@latest add card badge button select skeleton tabs tooltip
npx shadcn@latest add table dialog popover command separator scroll-area
npx shadcn@latest add chart          # Recharts wrapper — shadcn chart primitives
npx shadcn@latest add input label switch
npx shadcn@latest add dropdown-menu navigation-menu sheet  # Sidebar / mobile nav
npx shadcn@latest add progress       # Store share % progress bars
npx shadcn@latest add calendar       # Date range picker

# ── Step 3: Additional packages (not covered by shadcn)
# Excel file parsing (server-side)
npm install xlsx@0.18 exceljs@4

# State management
npm install zustand@5

# Data table
npm install @tanstack/react-table@8

# Date handling (already a shadcn peer dep)
npm install date-fns@3

# Number / currency formatting
npm install numeral@2
npm install --save-dev @types/numeral

# CSV/Excel export
npm install file-saver@2
npm install --save-dev @types/file-saver

# Drag-and-drop file upload
npm install react-dropzone@14

# Type-safe env
npm install --save-dev @types/node
```

### shadcn/ui Component → Feature Mapping

| shadcn Component | Where Used |
|-----------------|------------|
| `<Card>` | KPI cards on Dashboard, chart wrappers on every page |
| `<Badge>` | Return % status labels (green/amber/red) |
| `<Button>` | Volume/Value toggle, Export, Upload trigger |
| `<Select>` | City, State, Quarter filter dropdowns |
| `<Tabs>` | Daily/Weekly/Monthly trend toggle; Volume/Value toggle |
| `<Table>` | Channel analysis table, Brand summary table, Store table |
| `<Dialog>` | Drill-down detail modal (brand → category breakdown) |
| `<Skeleton>` | Loading states for all chart sections |
| `<Tooltip>` | Chart data-point tooltips |
| `<Progress>` | Store wise sales share % bar indicator |
| `<Calendar>` | Date range picker in Header |
| `<Popover>` | Date range picker popover wrapper |
| `<Command>` | Searchable brand / store filter with `cmdk` |
| `<Sheet>` | Mobile sidebar drawer |
| `<chart>` | Recharts `BarChart`, `LineChart`, `PieChart` via shadcn wrappers |
| `<NavigationMenu>` | Top-level header nav on wider screens |
| `<ScrollArea>` | Sidebar scroll, long store lists |
| `<Input>` | Store search debounced input |
| `<Switch>` | Theme toggle (dark/light) |

---

## 3. Folder Structure

```
sales-analytics/
├── app/
│   ├── layout.tsx                     # Root layout — sidebar + header shell
│   ├── page.tsx                       # Redirect → /dashboard
│   ├── globals.css                    # Tailwind v4 directives + CSS design tokens
│   │
│   ├── dashboard/
│   │   └── page.tsx                   # Sales Overview — KPI cards + mini charts
│   │
│   ├── brand-analysis/
│   │   └── page.tsx                   # Feature 1 — Brand wise Sales & Returns
│   │
│   ├── channel-analysis/
│   │   └── page.tsx                   # Feature 1 — Channel wise Sales & Returns
│   │
│   ├── category-analysis/
│   │   └── page.tsx                   # Feature 2 — Brand wise Category Sales
│   │
│   ├── discount-analysis/
│   │   └── page.tsx                   # Feature 3 — Avg Discount % vs Sales
│   │
│   ├── store-analysis/
│   │   └── page.tsx                   # Feature 4 — Store wise Sales
│   │
│   ├── returns-analysis/
│   │   └── page.tsx                   # Returns deep-dive + trend
│   │
│   └── api/
│       └── upload/
│           └── route.ts               # POST — parse uploaded xlsx, return JSON
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx                # Left nav with active-link highlighting
│   │   ├── Header.tsx                 # Date-range picker + Export button
│   │   └── PageWrapper.tsx            # Consistent page padding/title
│   │
│   ├── ui/                            # shadcn/ui generated — DO NOT hand-edit
│   │   ├── badge.tsx                  # npx shadcn add badge
│   │   ├── button.tsx                 # npx shadcn add button
│   │   ├── calendar.tsx               # npx shadcn add calendar
│   │   ├── card.tsx                   # npx shadcn add card
│   │   ├── chart.tsx                  # npx shadcn add chart (Recharts wrapper)
│   │   ├── command.tsx                # npx shadcn add command
│   │   ├── dialog.tsx                 # npx shadcn add dialog
│   │   ├── dropdown-menu.tsx          # npx shadcn add dropdown-menu
│   │   ├── input.tsx                  # npx shadcn add input
│   │   ├── label.tsx                  # npx shadcn add label
│   │   ├── navigation-menu.tsx        # npx shadcn add navigation-menu
│   │   ├── popover.tsx                # npx shadcn add popover
│   │   ├── progress.tsx               # npx shadcn add progress
│   │   ├── scroll-area.tsx            # npx shadcn add scroll-area
│   │   ├── select.tsx                 # npx shadcn add select
│   │   ├── separator.tsx              # npx shadcn add separator
│   │   ├── sheet.tsx                  # npx shadcn add sheet
│   │   ├── skeleton.tsx               # npx shadcn add skeleton
│   │   ├── switch.tsx                 # npx shadcn add switch
│   │   ├── table.tsx                  # npx shadcn add table
│   │   ├── tabs.tsx                   # npx shadcn add tabs
│   │   └── tooltip.tsx                # npx shadcn add tooltip
│   │
│   ├── upload/
│   │   └── FileUploader.tsx           # Drag-and-drop xlsx upload zone
│   │
│   ├── charts/
│   │   ├── BrandBarChart.tsx          # Grouped bar — Sales vs Return Vol/Val
│   │   ├── ChannelTable.tsx           # Tabular channel breakdown with Return%
│   │   ├── CategoryStackedBar.tsx     # Stacked bar — category within brand
│   │   ├── DiscountDonut.tsx          # Donut — discount % bucket distribution
│   │   ├── StoreBars.tsx              # Horizontal bar — store ranking
│   │   ├── TrendLineChart.tsx         # Daily/Weekly/Monthly line chart
│   │   └── TopCategoryPie.tsx         # Pie — top categories by value
│   │
│   ├── dashboard/
│   │   ├── KpiCard.tsx                # Stat card with trend indicator
│   │   ├── KeyInsights.tsx            # Auto-generated insights panel
│   │   └── SalesReturnTrend.tsx       # Line chart wrapper with period toggle
│   │
│   ├── filters/
│   │   ├── DateRangePicker.tsx        # Start/end date selector
│   │   ├── BrandFilter.tsx            # Multi-select brand dropdown
│   │   ├── ChannelFilter.tsx          # Channel multi-select
│   │   └── QuarterFilter.tsx          # Q1/Q2/Q3/Q4 pill selector
│   │
│   └── export/
│       └── ExportButton.tsx           # Exports current view to xlsx/csv
│
├── lib/
│   ├── data/
│   │   ├── parser.ts                  # xlsx → typed SalesRow[]
│   │   ├── aggregations.ts            # All aggregation functions (see §6)
│   │   └── transforms.ts              # Date helpers, normalise columns
│   │
│   ├── store/
│   │   ├── useDataStore.ts            # Zustand — global raw rows + filters
│   │   └── useFilterStore.ts          # Zustand — selected filters
│   │
│   ├── hooks/
│   │   ├── useSalesData.ts            # Derived selector — filtered rows
│   │   ├── useBrandMetrics.ts         # Brand-level aggregations
│   │   ├── useChannelMetrics.ts       # Channel-level aggregations
│   │   ├── useCategoryMetrics.ts      # Category-level aggregations
│   │   ├── useDiscountMetrics.ts      # Discount bucket analysis
│   │   └── useStoreMetrics.ts         # Store-level aggregations
│   │
│   └── utils/
│       ├── cn.ts                      # clsx + tailwind-merge helper
│       ├── format.ts                  # Currency (₹), number, percent formatters
│       └── colors.ts                  # Chart colour palette constants
│
├── types/
│   ├── sales.ts                       # SalesRow interface (all 28 columns)
│   ├── metrics.ts                     # BrandMetric, ChannelMetric, etc.
│   └── filters.ts                     # FilterState interface
│
├── public/
│   └── favicon.ico
│
├── Sales_data.xlsx                    # Source data (git-ignored in production)
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

---

## 4. TypeScript Types

### `types/sales.ts`

```ts
export interface SalesRow {
  channel: string;
  storeCode: number;
  storeName: string;
  sellerName: string;
  transactionType: 'IV' | 'SR' | 'IR';
  invoiceNo: string;
  invoiceDate: Date;
  ecomOrderNo: string;
  brandCode: string;
  brandName: string;
  barcode: number;
  totalSalesQty: number;
  unitMRP: number;
  invoiceMRPValue: number;
  invoiceDiscountValue: number;
  discountPct: number;         // raw decimal e.g. 0.1458
  nettInvoiceValue: number;
  value: number;
  status: 'Sales' | 'Return';
  quarter: string;
  finalCategory: string;
  fulfilmentRegion: string;
  fulfilmentCluster: string;
  fulfilmentState: string;
  fulfilmentCity: string;
  orderingRegion: string | null;
  orderingState: string | null;
  orderingCity: string | null;
}
```

### `types/metrics.ts`

```ts
export interface BrandMetric {
  brandCode: string;
  brandName: string;
  salesVolume: number;
  salesValue: number;
  returnVolume: number;
  returnValue: number;
  returnPct: number;
}

export interface ChannelMetric {
  channel: string;
  salesVolume: number;
  salesValue: number;
  returnVolume: number;
  returnValue: number;
  returnPct: number;
}

export interface CategoryMetric {
  brandName: string;
  category: string;
  salesVolume: number;
  salesValue: number;
}

export interface DiscountBucket {
  label: string;           // e.g. "0–5%"
  minPct: number;
  maxPct: number;
  count: number;
  pct: number;             // share of total
}

export interface StoreMetric {
  storeName: string;
  storeCode: number;
  salesValue: number;
  salesVolume: number;
  sharePct: number;
}
```

---

## 5. Data Parsing (`lib/data/parser.ts`)

```ts
import * as XLSX from 'xlsx';
import type { SalesRow } from '@/types/sales';

const COL_MAP: Record<number, keyof SalesRow> = {
  0:  'channel',
  1:  'storeCode',
  2:  'storeName',
  3:  'sellerName',
  4:  'transactionType',
  5:  'invoiceNo',
  6:  'invoiceDate',
  7:  'ecomOrderNo',
  8:  'brandCode',
  9:  'brandName',
  10: 'barcode',
  11: 'totalSalesQty',
  12: 'unitMRP',
  13: 'invoiceMRPValue',
  14: 'invoiceDiscountValue',
  15: 'discountPct',
  16: 'nettInvoiceValue',
  17: 'value',
  18: 'status',
  19: 'quarter',
  20: 'finalCategory',
  21: 'fulfilmentRegion',
  22: 'fulfilmentCluster',
  23: 'fulfilmentState',
  24: 'fulfilmentCity',
  25: 'orderingRegion',
  26: 'orderingState',
  27: 'orderingCity',
};

export function parseExcelBuffer(buffer: ArrayBuffer): SalesRow[] {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheet    = workbook.Sheets[workbook.SheetNames[0]];
  const raw      = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: null,
  }) as unknown[][];

  const [_header, ...dataRows] = raw;

  return dataRows
    .filter((row) => row[0] !== null)          // skip blank rows
    .map((row) => {
      const obj: Partial<SalesRow> = {};
      Object.entries(COL_MAP).forEach(([idx, key]) => {
        (obj as Record<string, unknown>)[key] = row[Number(idx)] ?? null;
      });
      // normalise discount: stored as decimal
      obj.discountPct = Number(obj.discountPct) || 0;
      return obj as SalesRow;
    });
}
```

---

## 6. Aggregation Functions (`lib/data/aggregations.ts`)

### Feature 1 — Brand & Channel Wise Sales + Returns

```ts
export function getBrandMetrics(rows: SalesRow[]): BrandMetric[] {
  const map = new Map<string, BrandMetric>();
  for (const row of rows) {
    const key   = row.brandCode;
    const entry = map.get(key) ?? {
      brandCode: row.brandCode, brandName: row.brandName,
      salesVolume: 0, salesValue: 0, returnVolume: 0, returnValue: 0, returnPct: 0,
    };
    if (row.transactionType === 'IV') {
      entry.salesVolume += row.totalSalesQty;
      entry.salesValue  += row.value;
    } else {
      entry.returnVolume += Math.abs(row.totalSalesQty);
      entry.returnValue  += Math.abs(row.value);
    }
    map.set(key, entry);
  }
  return [...map.values()].map((m) => ({
    ...m,
    returnPct: m.salesValue > 0 ? (m.returnValue / m.salesValue) * 100 : 0,
  }));
}

// getChannelMetrics — same pattern, group by row.channel
export function getChannelMetrics(rows: SalesRow[]): ChannelMetric[] { /* ... */ }
```

### Feature 2 — Brand Wise Category Sales

```ts
export function getCategoryMetrics(rows: SalesRow[]): CategoryMetric[] {
  // Group by brandName + finalCategory
  // Sum salesVolume and salesValue for IV only
}
```

### Feature 3 — Average Discount %

```ts
export function getDiscountMetrics(rows: SalesRow[]) {
  const salesRows = rows.filter((r) => r.transactionType === 'IV');
  const totalMRP  = salesRows.reduce((s, r) => s + r.invoiceMRPValue, 0);
  const totalDisc = salesRows.reduce((s, r) => s + r.invoiceDiscountValue, 0);
  const avgDiscount = totalMRP > 0 ? (totalDisc / totalMRP) * 100 : 0;

  const buckets: DiscountBucket[] = [
    { label: '0 – 5%',   minPct: 0,    maxPct: 0.05 },
    { label: '5 – 10%',  minPct: 0.05, maxPct: 0.10 },
    { label: '10 – 15%', minPct: 0.10, maxPct: 0.15 },
    { label: '15 – 20%', minPct: 0.15, maxPct: 0.20 },
    { label: '> 20%',    minPct: 0.20, maxPct: Infinity },
  ].map((b) => {
    const count = salesRows.filter(
      (r) => r.discountPct >= b.minPct && r.discountPct < b.maxPct
    ).length;
    return { ...b, count, pct: (count / salesRows.length) * 100 };
  });

  return { avgDiscount, buckets };
}
```

### Feature 4 — Store Wise Sales

```ts
export function getStoreMetrics(rows: SalesRow[]): StoreMetric[] {
  // Group by storeCode + storeName, sum salesValue (IV only)
  // Compute sharePct = storeValue / totalSalesValue * 100
  // Sort descending by salesValue
}
```

---

## 7. State Management

### `lib/store/useDataStore.ts`

```ts
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
  rows:     [],
  isLoaded: false,
  fileName: null,
  setRows: (rows, fileName) => set({ rows, isLoaded: true, fileName }),
  reset: () => set({ rows: [], isLoaded: false, fileName: null }),
}));
```

### `lib/store/useFilterStore.ts`

```ts
interface FilterStore {
  dateRange: { from: Date | null; to: Date | null };
  brands: string[];       // [] = all brands
  channels: string[];
  quarters: string[];
  setDateRange: (from: Date, to: Date) => void;
  setBrands: (brands: string[]) => void;
  setChannels: (channels: string[]) => void;
  setQuarters: (quarters: string[]) => void;
  reset: () => void;
}
```

---

## 8. API Route (`app/api/upload/route.ts`)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { parseExcelBuffer } from '@/lib/data/parser';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file     = formData.get('file') as File;

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const buffer = await file.arrayBuffer();
  const rows   = parseExcelBuffer(buffer);

  return NextResponse.json({ rows, count: rows.length });
}
```

---

## 9. Feature Pages

### Dashboard (`app/dashboard/page.tsx`)

**KPI Cards** (top row — 5 cards):
- Total Sales Value — `SUM(value) WHERE transactionType='IV'`
- Total Sales Volume — `SUM(totalSalesQty) WHERE transactionType='IV'`
- Total Return Value — `SUM(ABS(value)) WHERE transactionType IN ('SR','IR')`
- Total Return Volume
- Return % — `returnValue / salesValue * 100`

**Charts (below KPIs):**
- `BrandBarChart` — Volume/Value toggle
- `CategoryStackedBar`
- `DiscountDonut`
- `TrendLineChart` — Daily / Weekly / Monthly period toggle

---

### Brand Analysis (`app/brand-analysis/page.tsx`)

**Feature 1a — Brand Wise Sales & Returns**

- Grouped bar chart (`BrandBarChart`) — X: Brand, Y: Qty or Value
  - Two bars per brand: Sales (blue) + Return (pink)
  - Volume / Value toggle
- Summary table:
  `Brand | Sales Vol | Sales Value | Return Vol | Return Value | Return %`
- Return % badge: green < 5%, amber 5–10%, red > 10%

---

### Channel Analysis (`app/channel-analysis/page.tsx`)

**Feature 1b — Channel Wise Sales & Returns**

- `ChannelTable` — matches the reference image layout

| Channel | Sales (Vol) | Sales (Value) | Return (Vol) | Return (Value) | Return % |
|---------|------------|---------------|-------------|----------------|----------|
| Retail Store | 182,450 | ₹ 6,32,41,220 | 9,842 | ₹ 34,21,340 | 5.24% |

- Optional bar chart overlay for visual comparison
- Total row pinned to bottom

---

### Category Analysis (`app/category-analysis/page.tsx`)

**Feature 2 — Brand Wise Category Sales**

- `CategoryStackedBar` — X: Brand, Y: Sales Volume or Value
  - Stacked by `finalCategory` (Men / Women / Kids / Accessories)
- Legend for category colours
- Toggle: Volume / Value
- Drill-down table on brand click

---

### Discount Analysis (`app/discount-analysis/page.tsx`)

**Feature 3 — Average Discount % vs Sales**

- `DiscountDonut` — Donut chart, segments = discount buckets
  - Centre label: "Avg Discount **X.X%**"
  - Buckets: 0–5% / 5–10% / 10–15% / 15–20% / >20%
- Legend with count and share %
- Line chart: average discount % trend over time vs sales value

---

### Store Analysis (`app/store-analysis/page.tsx`)

**Feature 4 — Store Wise Sales**

- `StoreBars` — horizontal bar chart, ranked by sales value (descending)
- Each bar shows: Store Name | Value bar | ₹ Amount | Share %
- Colour: gradient from primary to muted based on rank
- Debounced search input to filter stores
- City / State filter dropdowns

---

## 10. File Upload Flow

```
User lands on /dashboard (empty state)
  → FileUploader shown (drag-and-drop or click to browse)
  → File chosen → POST /api/upload (FormData)
  → Server: parseExcelBuffer() → returns { rows: SalesRow[], count }
  → Client: useDataStore.setRows(rows, fileName)
  → All pages reactively receive data via useDataStore
  → Sidebar shows "Data Source: Sales_data.xlsx ✓"
```

The `FileUploader` component should:
1. Accept `.xlsx`, `.xls`, `.csv` MIME types
2. Show file name + row count on success
3. Show a spinner during parse
4. Show inline error on invalid/corrupt file

---

## 11. Data Filtering Hook (`lib/hooks/useSalesData.ts`)

```ts
export function useSalesData(): SalesRow[] {
  const { rows }                              = useDataStore();
  const { dateRange, brands, channels, quarters } = useFilterStore();

  return useMemo(() => {
    return rows.filter((r) => {
      const inDate    = (!dateRange.from || r.invoiceDate >= dateRange.from)
                     && (!dateRange.to   || r.invoiceDate <= dateRange.to);
      const inBrand   = brands.length   === 0 || brands.includes(r.brandCode);
      const inChannel = channels.length === 0 || channels.includes(r.channel);
      const inQuarter = quarters.length === 0 || quarters.includes(r.quarter);
      return inDate && inBrand && inChannel && inQuarter;
    });
  }, [rows, dateRange, brands, channels, quarters]);
}
```

---

## 12. Design System (`app/globals.css`)

```css
@import "tailwindcss";

:root {
  /* Brand */
  --color-primary:   220 91% 54%;   /* indigo-500 */
  --color-secondary: 262 83% 58%;   /* violet-500 */
  --color-accent:    199 89% 48%;   /* sky-500    */

  /* Semantic */
  --color-success:   142 71% 45%;
  --color-warning:    38 92% 50%;
  --color-danger:      0 84% 60%;

  /* Dark surface */
  --color-bg:        222 47% 7%;
  --color-surface:   222 47% 11%;
  --color-surface-2: 222 47% 15%;
  --color-border:    222 47% 20%;

  /* Text */
  --color-text:      210 40% 98%;
  --color-text-muted: 215 20% 65%;

  /* Chart palette (Recharts fill values) */
  --chart-1: #6366f1;   /* indigo  */
  --chart-2: #f472b6;   /* pink    */
  --chart-3: #34d399;   /* emerald */
  --chart-4: #fbbf24;   /* amber   */
  --chart-5: #60a5fa;   /* blue    */
  --chart-6: #a78bfa;   /* violet  */
}
```

---

## 13. Navigation (Sidebar Links)

```
📊  Dashboard           /dashboard
📈  Sales Overview      /dashboard
🏷️  Brand Analysis      /brand-analysis
📡  Channel Analysis    /channel-analysis
🗂️  Category Analysis   /category-analysis
🏪  Store Analysis      /store-analysis
💸  Discount Analysis   /discount-analysis
↩️  Returns Analysis    /returns-analysis
📄  Reports             /reports
```

Active link style: left accent border + subtle background highlight.

---

## 14. Export Feature

- `ExportButton` in the `Header` downloads the **currently filtered** data
- Formats: Excel (`.xlsx`) via `exceljs`, CSV via `file-saver`
- Each chart page has a per-chart **"Download PNG"** via Recharts SVG export

---

## 15. Best Practices

### shadcn/ui Usage Rules

- **Never hand-edit** files under `components/ui/` — they are shadcn-generated and will be overwritten on update. Compose them inside `components/charts/`, `components/dashboard/`, etc.
- Always consume shadcn components via the re-export barrel (`@/components/ui/...`).
- shadcn's `cn()` utility (from `lib/utils.ts`) replaces the manual `clsx + tailwind-merge` setup — delete any duplicate `lib/utils/cn.ts`.
- For charts, use `shadcn/ui chart` wrappers (`BarChart`, `LineChart`, `PieChart`) which are thin, accessible Recharts wrappers with built-in theming via CSS variables.

```tsx
// components/charts/BrandBarChart.tsx — shadcn chart pattern
'use client';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  salesVolume:  { label: 'Sales Volume',  color: 'var(--chart-1)' },
  returnVolume: { label: 'Return Volume', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function BrandBarChart({ data }: { data: BrandMetric[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="brandName" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="salesVolume"  fill="var(--color-salesVolume)"  radius={4} />
        <Bar dataKey="returnVolume" fill="var(--color-returnVolume)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
```

### Next.js 16 App Router

- All chart/interactive components are **Client Components** (`'use client'`)
- Data parsing runs in the **API route** (server-side) — keeps xlsx off client bundle
- Use `React.Suspense` + shadcn `<Skeleton>` for every chart section
- Avoid `useEffect` for data fetching; use Zustand + `useMemo` selectors

### Performance

- Lazy-import chart components via `next/dynamic` to avoid SSR mismatch:

```ts
const BrandBarChart = dynamic(() => import('@/components/charts/BrandBarChart'), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full" />,
});
```

- Large xlsx uploads sent as `FormData` — never base64 encoded
- All aggregations wrapped in `useMemo`, keyed on filtered rows reference

### Formatting

- Monetary values use Indian numbering: `₹ 1,23,45,678`

```ts
// lib/utils/format.ts
export const formatINR = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

export const formatPct = (v: number) => `${v.toFixed(2)}%`;
```

### shadcn Table Pattern (Channel Analysis)

```tsx
// components/charts/ChannelTable.tsx
import {
  Table, TableBody, TableCell, TableFooter,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

function ReturnBadge({ pct }: { pct: number }) {
  const variant = pct < 5 ? 'success' : pct < 10 ? 'warning' : 'destructive';
  return <Badge variant={variant}>{pct.toFixed(2)}%</Badge>;
}

export function ChannelTable({ data }: { data: ChannelMetric[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Channel</TableHead>
          <TableHead className="text-right">Sales (Vol)</TableHead>
          <TableHead className="text-right">Sales (Value)</TableHead>
          <TableHead className="text-right">Return (Vol)</TableHead>
          <TableHead className="text-right">Return (Value)</TableHead>
          <TableHead className="text-right">Return %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.channel}>
            <TableCell>{row.channel}</TableCell>
            <TableCell className="text-right">{row.salesVolume.toLocaleString('en-IN')}</TableCell>
            <TableCell className="text-right">{formatINR(row.salesValue)}</TableCell>
            <TableCell className="text-right">{row.returnVolume.toLocaleString('en-IN')}</TableCell>
            <TableCell className="text-right">{formatINR(row.returnValue)}</TableCell>
            <TableCell className="text-right"><ReturnBadge pct={row.returnPct} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Code Style

- ESLint + Prettier via `eslint.config.mjs`
- Component files: `PascalCase.tsx`
- shadcn-generated files in `components/ui/`: `kebab-case.tsx` (leave as-is)
- Hooks: `useCamelCase.ts`
- Utility functions: `camelCase`

---

## 16. Development Commands

```bash
# Install all dependencies
npm install

# Start dev server (Turbopack — Next.js 16 default)
npm run dev
# → http://localhost:3000

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Production build + start
npm run build && npm start
```

---

## 17. Implementation Order

Build in this sequence to avoid dependency issues:

| Step | Task |
|------|------|
| 1 | **shadcn init** — `npx shadcn@latest init`, then add all components listed in §2 |
| 2 | **Types** — `types/sales.ts`, `types/metrics.ts`, `types/filters.ts` |
| 3 | **Parser** — `lib/data/parser.ts` with column map from §1 |
| 4 | **Stores** — `useDataStore`, `useFilterStore` (Zustand) |
| 5 | **Aggregations** — `lib/data/aggregations.ts` (all 4 features) |
| 6 | **Hooks** — `useSalesData`, `useBrandMetrics`, `useChannelMetrics`, etc. |
| 7 | **Design system** — `globals.css` CSS variables + `format.ts`, `colors.ts` |
| 8 | **Layout** — `Sidebar` (with `<Sheet>` mobile), `Header`, `PageWrapper` |
| 9 | **FileUploader** + `/api/upload` route |
| 10 | **Dashboard** — `<Card>` KPI cards, then shadcn chart wrappers |
| 11 | **Feature pages** — Brand → Channel (`<Table>`) → Category → Discount → Store (`<Progress>`) |
| 12 | **Filters** — `<Calendar>` date range, `<Command>` brand search, `<Select>` dropdowns |
| 13 | **Export** — xlsx/CSV download, PNG per chart |

---

## 18. Agent Skill Reference

This workspace ships a **senior-frontend skill** at:

```
.agents/skills/senior-frontend/SKILL.md
```

Any coding agent (Antigravity / Gemini IDE) working on this project **must read this skill before writing any React, Next.js, or TypeScript code**. It encodes:

| Concern | Guidance in SKILL.md |
|---------|---------------------|
| Project scaffolding | Next.js App Router template, generated structure |
| Component generation | `'use client'` vs server component rules |
| Bundle analysis | Heavy dependency alternatives, per-route budget |
| React patterns | Compound components, custom hooks, render props |
| Next.js optimisation | `next/dynamic`, `Image`, parallel data fetching |
| Accessibility | WCAG AA checklist, semantic HTML, focus states |
| Decision engine | Profile selection: `next-app-router` (this project) |
| Forcing questions | 7 questions that must be answered before locking any framework decision |

### Profile for this project

Based on the forcing-question library in the skill, this project maps to the **`next-app-router`** profile:

| Criterion | Value |
|-----------|-------|
| Primary device | Desktop / corporate |
| LCP target | ≤ 2000 ms (mobile-4G p75) |
| Rendering | RSC + `'use client'` islands |
| Bundle budget | 150 KB-gzip / route |
| SEO-dependent | No (auth-walled analytics tool) |
| WCAG target | AA, best-effort |

### How to invoke the skill

```bash
# From the Antigravity IDE, reference the skill explicitly:
# @skill senior-frontend

# Or use the slash command:
# /cs:frontend-review <your problem>
```

See [`.agents/skills/senior-frontend/SKILL.md`](.agents/skills/senior-frontend/SKILL.md) for the full guide.

---

## 19. Implementation Status (audited 2026-09-09)

> Audit compares the actual file tree and content against §§ 2–17 of this guide.

### ✅ Fully Implemented

| Area | Files |
|------|-------|
| **shadcn/ui init** | `components.json` present, style = `base-nova`, CSS variables enabled |
| **All shadcn UI components** | `badge`, `button`, `calendar`, `card`, `chart`, `command`, `dialog`, `dropdown-menu`, `input`, `label`, `navigation-menu`, `popover`, `progress`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `switch`, `table`, `tabs`, `textarea`, `tooltip` — all present in `components/ui/` |
| **TypeScript types** | `types/sales.ts`, `types/metrics.ts`, `types/filters.ts` — all present and non-empty |
| **Excel parser** | `lib/data/parser.ts` — `xlsx` import, `COL_MAP`, `parseExcelBuffer()` |
| **All 5 aggregation functions** | `lib/data/aggregations.ts` — `getBrandMetrics`, `getChannelMetrics`, `getCategoryMetrics`, `getDiscountMetrics`, `getStoreMetrics` |
| **Zustand stores** | `lib/store/useDataStore.ts`, `lib/store/useFilterStore.ts` |
| **All 6 hooks** | `useSalesData`, `useBrandMetrics`, `useChannelMetrics`, `useCategoryMetrics`, `useDiscountMetrics`, `useStoreMetrics` |
| **Utility functions** | `lib/utils/format.ts` (formatINR, formatPct), `lib/utils/colors.ts` (CHART_COLORS) |
| **Layout components** | `Sidebar.tsx`, `Header.tsx`, `PageWrapper.tsx` |
| **File uploader** | `components/upload/FileUploader.tsx` — `react-dropzone`, MIME filtering, spinner, error state |
| **Export button** | `components/export/ExportButton.tsx` — xlsx + CSV via `file-saver` |
| **KPI card** | `components/dashboard/KpiCard.tsx` — uses shadcn `<Card>` |
| **All chart components** | `BrandBarChart`, `CategoryStackedBar`, `ChannelTable`, `DiscountDonut`, `StoreBars`, `TrendLineChart` |
| **All feature pages** | `dashboard`, `brand-analysis`, `channel-analysis`, `category-analysis`, `discount-analysis`, `store-analysis`, `returns-analysis` — all present |
| **API route** | `app/api/upload/route.ts` — `POST` handler, `parseExcelBuffer`, returns JSON |
| **Root layout** | `app/layout.tsx` — `<TooltipProvider>`, `<Sidebar>` wired in |
| **Root redirect** | `app/page.tsx` — redirects to `/dashboard` |
| **Design tokens** | `app/globals.css` — all CSS variables (`--chart-1..6`, `--color-primary`, `--color-surface`, etc.) |
| **shadcn cn utility** | `lib/utils.ts` — exports `cn` from the `cn` package |
| **Next.js dynamic imports** | Used in `dashboard`, `brand-analysis`, `category-analysis`, `discount-analysis`, `returns-analysis` pages |

---

### ⚠️ Gaps — Action Required

#### 1. `components/filters/` — **entirely missing**

The build plan calls for four filter components that are not yet created:

| File | Purpose |
|------|---------|
| `components/filters/DateRangePicker.tsx` | `<Calendar>` + `<Popover>` date range picker wired to `useFilterStore` |
| `components/filters/BrandFilter.tsx` | `<Command>` multi-select for brand filtering |
| `components/filters/ChannelFilter.tsx` | `<Select>` multi-select for channel filtering |
| `components/filters/QuarterFilter.tsx` | Pill toggle for Q1/Q2/Q3/Q4 |

**Impact**: `Header.tsx` date range picker and all per-page filters are non-functional or hard-coded.

**Fix**:
```bash
# Create the filters directory and stub each component
mkdir -p components/filters
# Then implement each using shadcn primitives:
# DateRangePicker  → <Popover> + <Calendar> (react-day-picker already installed)
# BrandFilter      → <Command> + <CommandInput> + checkboxes
# ChannelFilter    → <Select> with multiple
# QuarterFilter    → <Tabs> or <Button variant="outline"> pill group
```

---

#### 2. `components/dashboard/KeyInsights.tsx` — **missing**

Referenced in §9 (Dashboard) but not created. This is the auto-generated insights panel shown in the bottom-right of the reference image.

**Fix**: Create `components/dashboard/KeyInsights.tsx` that computes top-N insights from aggregation results (highest brand, lowest return %, highest store) and renders them as a list of `<Card>` entries with `<Badge>`.

---

#### 3. `components/dashboard/SalesReturnTrend.tsx` — **missing**

The line chart wrapper with Daily/Weekly/Monthly toggle for the dashboard. `TrendLineChart.tsx` exists in `components/charts/` but the dashboard-specific wrapper with period state is absent.

**Fix**: Create `components/dashboard/SalesReturnTrend.tsx` that wraps `<TrendLineChart>` with a `<Tabs>` period selector and passes the correct `groupBy` prop.

---

#### 4. `components/charts/TopCategoryPie.tsx` — **missing**

Listed in §3 folder structure. The pie chart for "Top Categories by Sales Value" shown bottom-centre in the reference image.

**Fix**: Create `components/charts/TopCategoryPie.tsx` using the shadcn `<ChartContainer>` + Recharts `<PieChart>`.

---

#### 5. `lib/data/transforms.ts` — **missing**

Listed in §3 as the date helpers / column normalisation module. Currently all normalisation is inline in `parser.ts`.

**Fix**: Extract date parsing helpers (`toDate`, `normaliseQty`, `normaliseDiscount`) into `lib/data/transforms.ts` and import them from `parser.ts`.

---

#### 6. `lib/utils.ts` — **non-standard `cn` export**

Current content:
```ts
export { cn } from "cn"
```

shadcn's standard generated `lib/utils.ts` is:
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

The `cn` npm package is **not** the same as the shadcn utility. Using it may cause Tailwind class merging bugs (e.g. conflicting responsive classes not being resolved correctly).

**Fix**:
```bash
npm install clsx tailwind-merge
```
Then replace `lib/utils.ts` with the standard shadcn `cn` implementation above.

---

#### 7. `globals.css` — missing dark-mode surface variables on `body`

The CSS variables for dark surface are defined in `:root` but `body` still uses `var(--background)` which defaults to white. The sidebar and cards will not pick up the dark theme tokens automatically.

**Fix**: Add a `.dark` class block or `@media (prefers-color-scheme: dark)` that overrides `--background` with `hsl(var(--color-bg))`.

---

#### 8. `next.config.ts` — empty config

Currently `nextConfig = {}`. Should enable `optimizePackageImports` for `lucide-react` and `recharts` to reduce bundle size (recommended by the `senior-frontend` skill).

**Fix**:
```ts
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};
```

---

#### 9. `components/ui/` — extra undocumented files

Two files exist that were not in the `npx shadcn add` commands listed in §2:
- `input-group.tsx` — not a standard shadcn component, likely auto-generated
- `textarea.tsx` — not needed for this app

These are safe to keep but should be noted as not part of the planned component set.

---

### 📦 Package Discrepancies

| Installed | Notes |
|-----------|-------|
| `recharts@3.8.0` | ⚠️ Build plan specified `recharts@2`. v3 has breaking API changes — `<Legend>` and `<Tooltip>` props differ. Verify chart components work with v3. |
| `lucide-react@1.43.0` | ⚠️ Build plan specified `@0.400`. v1.x is a major bump; icon names may have changed. |
| `date-fns@4.4.0` | ⚠️ Build plan specified `date-fns@3`. v4 has breaking changes in locale imports. |
| `@base-ui/react@1.8.0` | ℹ️ Not in build plan — appears to be a shadcn peer dependency, safe to keep. |
| `shadcn@4.21.0` | ✅ Correct — the shadcn CLI package. |
| `zustand@5.0.15` | ✅ Matches plan. |
| `@tanstack/react-table@8.21.3` | ✅ Matches plan. |

---

### 🔲 Remaining Work Summary

```
Priority  Component / File                         Effort
HIGH      components/filters/DateRangePicker.tsx   Medium
HIGH      components/filters/BrandFilter.tsx        Small
HIGH      components/filters/ChannelFilter.tsx      Small
HIGH      components/filters/QuarterFilter.tsx      Small
HIGH      lib/utils.ts — fix cn() implementation   Trivial
MEDIUM    components/dashboard/KeyInsights.tsx      Medium
MEDIUM    components/dashboard/SalesReturnTrend.tsx Small
MEDIUM    components/charts/TopCategoryPie.tsx      Small
MEDIUM    next.config.ts — optimizePackageImports   Trivial
LOW       lib/data/transforms.ts extraction         Small
LOW       globals.css — dark mode body fix          Trivial
LOW       Verify recharts v3 / lucide v1 compat     Medium
```
