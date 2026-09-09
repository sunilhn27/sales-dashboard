import type { SalesRow } from '@/types/sales';
import type { BrandMetric, ChannelMetric, CategoryMetric, DiscountBucket, StoreMetric } from '@/types/metrics';

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
  const salesRows = rows.filter((r) => r.transactionType === 'IV');
  const totalMRP = salesRows.reduce((s, r) => s + r.invoiceMRPValue, 0);
  const totalDisc = salesRows.reduce((s, r) => s + r.invoiceDiscountValue, 0);
  const avgDiscount = totalMRP > 0 ? (totalDisc / totalMRP) * 100 : 0;

  const buckets: DiscountBucket[] = [
    { label: '0 – 5%', minPct: 0, maxPct: 0.05, count: 0, pct: 0 },
    { label: '5 – 10%', minPct: 0.05, maxPct: 0.10, count: 0, pct: 0 },
    { label: '10 – 15%', minPct: 0.10, maxPct: 0.15, count: 0, pct: 0 },
    { label: '15 – 20%', minPct: 0.15, maxPct: 0.20, count: 0, pct: 0 },
    { label: '> 20%', minPct: 0.20, maxPct: Infinity, count: 0, pct: 0 },
  ].map((b) => {
    const count = salesRows.filter(
      (r) => r.discountPct >= b.minPct && r.discountPct < b.maxPct
    ).length;
    return { ...b, count, pct: (count / salesRows.length) * 100 };
  });

  return { avgDiscount, buckets };
}

export function getStoreMetrics(rows: SalesRow[]): StoreMetric[] {
  const map = new Map<number, StoreMetric>();
  const totalSalesValue = rows
    .filter((r) => r.transactionType === 'IV')
    .reduce((s, r) => s + r.value, 0);

  for (const row of rows) {
    if (row.transactionType === 'IV') {
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
  }

  return [...map.values()]
    .map((m) => ({
      ...m,
      sharePct: totalSalesValue > 0 ? (m.salesValue / totalSalesValue) * 100 : 0,
    }))
    .sort((a, b) => b.salesValue - a.salesValue);
}
