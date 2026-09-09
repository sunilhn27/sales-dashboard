import type { SalesRow } from '@/types/sales';
import type { BrandChannelMetric, BrandMetric, ChannelMetric, CategoryMetric, DiscountBucket, LocationMetric, StoreMetric, TopCategoryMetric } from '@/types/metrics';

export function getBrandMetrics(rows: SalesRow[]): BrandMetric[] {
  const map = new Map<string, BrandMetric>();
  for (const row of rows) {
    const key = row.brandCode;
    const entry = map.get(key) ?? {
      brandCode: row.brandCode,
      brandName: row.brandName,
      salesVolume: 0,
      salesValue: 0,
      returnVolume: 0,
      returnValue: 0,
      returnPct: 0,
    };
    if (row.transactionType === 'IV') {
      entry.salesVolume += row.totalSalesQty;
      entry.salesValue += row.value;
    } else {
      entry.returnVolume += Math.abs(row.totalSalesQty);
      entry.returnValue += Math.abs(row.value);
    }
    map.set(key, entry);
  }
  return [...map.values()].map((m) => ({
    ...m,
    returnPct: m.salesValue > 0 ? (m.returnValue / m.salesValue) * 100 : 0,
  }));
}

export function getChannelMetrics(rows: SalesRow[]): ChannelMetric[] {
  const map = new Map<string, ChannelMetric>();
  for (const row of rows) {
    const key = row.channel;
    const entry = map.get(key) ?? {
      channel: row.channel,
      salesVolume: 0,
      salesValue: 0,
      returnVolume: 0,
      returnValue: 0,
      returnPct: 0,
    };
    if (row.transactionType === 'IV') {
      entry.salesVolume += row.totalSalesQty;
      entry.salesValue += row.value;
    } else {
      entry.returnVolume += Math.abs(row.totalSalesQty);
      entry.returnValue += Math.abs(row.value);
    }
    map.set(key, entry);
  }
  return [...map.values()].map((m) => ({
    ...m,
    returnPct: m.salesValue > 0 ? (m.returnValue / m.salesValue) * 100 : 0,
  }));
}

export function getCategoryMetrics(rows: SalesRow[]): CategoryMetric[] {
  const map = new Map<string, CategoryMetric>();
  for (const row of rows) {
    if (row.transactionType === 'IV') {
      const key = `${row.brandName}-${row.finalCategory}`;
      const entry = map.get(key) ?? {
        brandName: row.brandName,
        category: row.finalCategory,
        salesVolume: 0,
        salesValue: 0,
      };
      entry.salesVolume += row.totalSalesQty;
      entry.salesValue += row.value;
      map.set(key, entry);
    }
  }
  return [...map.values()];
}

export function getDiscountMetrics(rows: SalesRow[]) {
  const buckets: DiscountBucket[] = [
    { label: '0 – 5%', minPct: 0, maxPct: 0.05, count: 0, pct: 0 },
    { label: '5 – 10%', minPct: 0.05, maxPct: 0.10, count: 0, pct: 0 },
    { label: '10 – 15%', minPct: 0.10, maxPct: 0.15, count: 0, pct: 0 },
    { label: '15 – 20%', minPct: 0.15, maxPct: 0.20, count: 0, pct: 0 },
    { label: '> 20%', minPct: 0.20, maxPct: Infinity, count: 0, pct: 0 },
  ];

  // Single pass over IV rows: accumulate MRP/discount and count buckets together
  let totalMRP = 0;
  let totalDisc = 0;
  let salesCount = 0;
  for (const r of rows) {
    if (r.transactionType !== 'IV') continue;
    totalMRP += r.invoiceMRPValue;
    totalDisc += r.invoiceDiscountValue;
    salesCount++;
    for (const b of buckets) {
      if (r.discountPct >= b.minPct && r.discountPct < b.maxPct) {
        b.count++;
        break;
      }
    }
  }

  const avgDiscount = totalMRP > 0 ? (totalDisc / totalMRP) * 100 : 0;
  const withPct = buckets.map((b) => ({
    ...b,
    pct: salesCount > 0 ? (b.count / salesCount) * 100 : 0,
  }));

  return { avgDiscount, buckets: withPct };
}

export function getStoreMetrics(rows: SalesRow[]): StoreMetric[] {
  const map = new Map<number, StoreMetric>();

  // Single pass: accumulate store totals and the grand total together
  let totalSalesValue = 0;
  for (const row of rows) {
    if (row.transactionType !== 'IV') continue;
    totalSalesValue += row.value;
    const key = row.storeCode;
    const entry = map.get(key) ?? {
      storeName: row.storeName,
      storeCode: row.storeCode,
      salesValue: 0,
      salesVolume: 0,
      sharePct: 0,
    };
    entry.salesValue += row.value;
    entry.salesVolume += row.totalSalesQty;
    map.set(key, entry);
  }

  return [...map.values()]
    .map((m) => ({
      ...m,
      sharePct:
        totalSalesValue > 0 ? (m.salesValue / totalSalesValue) * 100 : 0,
    }))
    .sort((a, b) => b.salesValue - a.salesValue);
}

export function getBrandChannelMetrics(rows: SalesRow[]): BrandChannelMetric[] {
  const map = new Map<string, BrandChannelMetric>();

  // Single pass, grouped by brand + channel
  for (const row of rows) {
    const key = `${row.brandName}-${row.channel}`;
    const entry = map.get(key) ?? {
      brandName: row.brandName,
      channel: row.channel,
      salesVolume: 0,
      salesValue: 0,
      returnVolume: 0,
      returnValue: 0,
      returnPct: 0,
    };
    if (row.transactionType === 'IV') {
      entry.salesVolume += row.totalSalesQty;
      entry.salesValue += row.value;
    } else {
      entry.returnVolume += Math.abs(row.totalSalesQty);
      entry.returnValue += Math.abs(row.value);
    }
    map.set(key, entry);
  }

  return [...map.values()]
    .map((m) => ({
      ...m,
      returnPct: m.salesValue > 0 ? (m.returnValue / m.salesValue) * 100 : 0,
    }))
    .sort((a, b) => b.salesValue - a.salesValue);
}

export function getTopCategoryMetrics(rows: SalesRow[]): TopCategoryMetric[] {
  const map = new Map<string, number>();

  // Single pass over IV rows, grouped by final category
  let totalSalesValue = 0;
  for (const row of rows) {
    if (row.transactionType !== 'IV') continue;
    const key = row.finalCategory || 'Unknown';
    map.set(key, (map.get(key) ?? 0) + row.value);
    totalSalesValue += row.value;
  }

  return [...map.entries()]
    .map(([category, salesValue]) => ({
      category,
      salesValue,
      sharePct:
        totalSalesValue > 0 ? (salesValue / totalSalesValue) * 100 : 0,
    }))
    .sort((a, b) => b.salesValue - a.salesValue);
}

export function getLocationMetrics(rows: SalesRow[]): LocationMetric[] {
  const map = new Map<string, { salesVolume: number; salesValue: number }>();

  // Single pass over IV rows, grouped by fulfilment region
  let totalSalesValue = 0;
  for (const row of rows) {
    if (row.transactionType !== 'IV') continue;
    totalSalesValue += row.value;
    const key = row.fulfilmentRegion || 'Unknown';
    const entry = map.get(key) ?? { salesVolume: 0, salesValue: 0 };
    entry.salesVolume += row.totalSalesQty;
    entry.salesValue += row.value;
    map.set(key, entry);
  }

  return [...map.entries()]
    .map(([location, m]) => ({
      location,
      salesVolume: m.salesVolume,
      salesValue: m.salesValue,
      sharePct:
        totalSalesValue > 0 ? (m.salesValue / totalSalesValue) * 100 : 0,
    }))
    .sort((a, b) => b.salesValue - a.salesValue);
}
