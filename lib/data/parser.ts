import * as XLSX from 'xlsx';
import type { SalesRow } from '@/types/sales';

const COL_MAP: Record<number, keyof SalesRow> = {
  0: 'channel',
  1: 'storeCode',
  2: 'storeName',
  3: 'sellerName',
  4: 'transactionType',
  5: 'invoiceNo',
  6: 'invoiceDate',
  7: 'ecomOrderNo',
  8: 'brandCode',
  9: 'brandName',
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
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: null,
  }) as unknown[][];

  const [_header, ...dataRows] = raw;

  return dataRows
    .filter((row) => row[0] !== null)
    .map((row) => {
      const obj: Partial<SalesRow> = {};
      Object.entries(COL_MAP).forEach(([idx, key]) => {
        (obj as Record<string, unknown>)[key] = row[Number(idx)] ?? null;
      });
      obj.discountPct = Number(obj.discountPct) || 0;
      return obj as SalesRow;
    });
}
