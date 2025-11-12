import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Excel Export Functions
export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Generate buffer
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // Save file
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
};

export const exportMultipleSheetsToExcel = (
  sheets: { name: string; data: any[] }[],
  filename: string
) => {
  const wb = XLSX.utils.book_new();

  sheets.forEach(sheet => {
    const ws = XLSX.utils.json_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
};

// PDF Export Helper (works with react-to-print)
export const getPrintStyles = () => `
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    @page {
      size: A4;
      margin: 20mm;
    }

    .no-print {
      display: none !important;
    }

    .print-page-break {
      page-break-after: always;
    }

    .ant-card {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    canvas {
      max-width: 100% !important;
      height: auto !important;
    }
  }
`;

// Format currency for export
export const formatCurrencyForExport = (value: number): string => {
  // Handle null, undefined, or NaN values
  if (value == null || isNaN(value)) {
    return '0 ₫';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

// Format date for export
export const formatDateForExport = (date: Date | string): string => {
  // Handle null or undefined
  if (date == null) {
    return '-';
  }

  const d = typeof date === 'string' ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(d.getTime())) {
    return '-';
  }

  return d.toLocaleDateString('vi-VN');
};

// Convert chart data for Excel export
export const prepareChartDataForExcel = (
  data: any[],
  xField: string,
  yField: string,
  additionalFields?: string[]
) => {
  return data.map(item => {
    const row: any = {
      [xField]: item[xField],
      [yField]: item[yField],
    };

    if (additionalFields) {
      additionalFields.forEach(field => {
        row[field] = item[field];
      });
    }

    return row;
  });
};
