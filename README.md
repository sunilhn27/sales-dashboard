# Sales Analytics Dashboard

A comprehensive sales analytics dashboard built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. Premium light-themed UI with soft glassmorphism styling.

## Features

- **Dashboard** - Overview with KPI cards, charts, key insights, and trend analysis
- **Brand Analysis** - Brand-wise sales and returns performance
- **Channel Analysis** - Channel-wise sales breakdown with return percentages
- **Category Analysis** - Brand-wise category sales distribution
- **Store Analysis** - Store-wise sales rankings with progress indicators
- **Discount Analysis** - Discount distribution and average discount metrics
- **Returns Analysis** - Deep-dive into sales returns with trend analysis
- **Upload with progress** - Live progress bar while the Excel file uploads and parses
- **Replace data source** - Swap in a new Excel file any time from the sidebar

## Tech Stack

- **Framework**: Next.js 16.3 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **State Management**: Zustand
- **Charts**: Recharts (via shadcn chart wrappers)
- **Excel Parsing**: xlsx + ExcelJS
- **Date Handling**: date-fns
- **File Export**: file-saver

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sales-analytics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload Data**: Drag and drop your Excel file (.xlsx, .xls, or .csv) on the dashboard — a progress bar shows upload and parsing status
2. **Navigate**: Use the sidebar to switch between different analysis views
3. **Replace Data**: Click **Replace Excel File** in the sidebar (below Returns Analysis) to swap in a new file at any time
4. **Filter Data**: Use the date-range picker in the header to narrow down your analysis
5. **Export**: Download your filtered data as Excel or CSV from the header

## Project Structure

```
sales-analytics/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main dashboard with KPIs
│   ├── brand-analysis/     # Brand-wise analysis
│   ├── channel-analysis/   # Channel-wise analysis
│   ├── category-analysis/  # Category distribution
│   ├── store-analysis/     # Store rankings
│   ├── discount-analysis/  # Discount metrics
│   └── returns-analysis/   # Returns deep-dive
├── components/
│   ├── charts/             # Recharts chart components
│   ├── dashboard/          # Dashboard-specific components
│   ├── export/             # Export functionality
│   ├── layout/             # Layout components (Sidebar, Header)
│   ├── ui/                 # shadcn/ui components
│   └── upload/             # File upload component
├── lib/
│   ├── data/               # Data parsing and aggregations
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand stores
│   └── utils/              # Utility functions
└── types/                  # TypeScript type definitions
```

## Data Schema

The application expects Excel files with the following columns:

| Column | Description |
|--------|-------------|
| Channel | Sales channel |
| Store code | Numeric store identifier |
| Store name | Human-readable store name |
| Seller name | Seller/distributor name |
| Transaction Type | IV (Invoice), SR (Sales Return), IR (Internal Return) |
| Invoice No | Invoice reference number |
| Invoice Date | Transaction date |
| Brand Code | Short brand identifier |
| Brand Name | Full brand name |
| Barcode | Product barcode/SKU |
| Total Sales Qty | Units sold (negative for returns) |
| Unit MRP | Maximum retail price per unit |
| Invoice MRP Value | Gross MRP value |
| Invoice Discount Value | Total discount applied |
| Discount % | Discount as decimal |
| Nett Invoice Value | Net value after discount |
| Value | Final settled value |
| Status | Sales or Return |
| Quarter | Financial quarter (Q1-Q4) |
| Final Category | Product category code |
| Fulfilment Region/Cluster/State/City | Dispatch location |
| Ordering Region/State/City | Order origin location |

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Features in Detail

### Dashboard
- 5 KPI cards (Sales Value, Sales Volume, Return Value, Return Volume, Return %) with colourful icon accents
- Brand performance bar chart
- Category distribution stacked bar chart
- Discount distribution donut chart
- Sales trend line chart (daily/weekly/monthly)
- Key Insights panel (top brand, top store, return rate highlights)
- Top categories pie chart
- Store wise sales ranking with share progress bars

### Brand Analysis
- Grouped bar chart showing Sales vs Returns
- Toggle between Volume and Value views
- Summary table with return percentage badges

### Channel Analysis
- Channel-wise breakdown table with channel avatars
- Total row with aggregated metrics
- Return percentage indicators with mini progress bars

### Category Analysis
- Stacked bar chart by category
- Brand-wise category distribution
- Toggle between Volume and Value

### Store Analysis
- Horizontal bar chart ranked by sales value
- Progress bars showing market share
- Search functionality for filtering stores

### Discount Analysis
- Donut chart showing discount distribution
- Center label with average discount percentage
- Bucket breakdown table with colour-coded ranges and share bars

### Returns Analysis
- Return statistics cards
- Return trend line chart
- Daily/weekly/monthly period toggle

## Export Features

- **Excel Export**: Download filtered data as .xlsx
- **CSV Export**: Download filtered data as .csv
- Preserves all 28 data columns

## License

MIT
