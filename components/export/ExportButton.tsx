'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSalesData } from '@/lib/hooks/useSalesData';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const rows = useSalesData();

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sales Data');

      worksheet.columns = [
        { header: 'Channel', key: 'channel', width: 20 },
        { header: 'Store Code', key: 'storeCode', width: 12 },
        { header: 'Store Name', key: 'storeName', width: 25 },
        { header: 'Seller Name', key: 'sellerName', width: 20 },
        { header: 'Transaction Type', key: 'transactionType', width: 15 },
        { header: 'Invoice No', key: 'invoiceNo', width: 15 },
        { header: 'Invoice Date', key: 'invoiceDate', width: 15 },
        { header: 'Ecom Order No', key: 'ecomOrderNo', width: 15 },
        { header: 'Brand Code', key: 'brandCode', width: 12 },
        { header: 'Brand Name', key: 'brandName', width: 20 },
        { header: 'Barcode', key: 'barcode', width: 15 },
        { header: 'Total Sales Qty', key: 'totalSalesQty', width: 15 },
        { header: 'Unit MRP', key: 'unitMRP', width: 12 },
        { header: 'Invoice MRP Value', key: 'invoiceMRPValue', width: 18 },
        {
          header: 'Invoice Discount Value',
          key: 'invoiceDiscountValue',
          width: 20,
        },
        { header: 'Discount %', key: 'discountPct', width: 12 },
        { header: 'Nett Invoice Value', key: 'nettInvoiceValue', width: 18 },
        { header: 'Value', key: 'value', width: 12 },
        { header: 'Status', key: 'status', width: 10 },
        { header: 'Quarter', key: 'quarter', width: 10 },
        { header: 'Final Category', key: 'finalCategory', width: 15 },
        { header: 'Fulfilment Region', key: 'fulfilmentRegion', width: 18 },
        { header: 'Fulfilment Cluster', key: 'fulfilmentCluster', width: 18 },
        { header: 'Fulfilment State', key: 'fulfilmentState', width: 18 },
        { header: 'Fulfilment City', key: 'fulfilmentCity', width: 18 },
        { header: 'Ordering Region', key: 'orderingRegion', width: 18 },
        { header: 'Ordering State', key: 'orderingState', width: 18 },
        { header: 'Ordering City', key: 'orderingCity', width: 18 },
      ];

      rows.forEach((row) => {
        worksheet.addRow(row);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `sales_data_${new Date().toISOString().split('T')[0]}.xlsx`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const headers = Object.keys(rows[0] || {}).join(',');
      const csvRows = rows.map((row) =>
        Object.values(row)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      );
      const csv = [headers, ...csvRows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `sales_data_${new Date().toISOString().split('T')[0]}.csv`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" disabled={isExporting} />}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
