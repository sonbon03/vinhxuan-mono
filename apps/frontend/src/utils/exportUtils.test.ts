import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatCurrencyForExport, formatDateForExport, exportToExcel } from './exportUtils';
import * as FileSaver from 'file-saver';

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));

describe('exportUtils', () => {
  describe('formatCurrencyForExport', () => {
    it('should format currency with dots as thousand separators', () => {
      expect(formatCurrencyForExport(1000000)).toMatch(/1\.000\.000\s+₫/);
      expect(formatCurrencyForExport(500000)).toMatch(/500\.000\s+₫/);
      expect(formatCurrencyForExport(0)).toMatch(/0\s+₫/);
    });

    it('should handle negative values', () => {
      expect(formatCurrencyForExport(-1000000)).toMatch(/-1\.000\.000\s+₫/);
    });

    it('should handle decimal values', () => {
      // VND currency rounds to nearest integer (no decimal places)
      expect(formatCurrencyForExport(1234567.89)).toMatch(/1\.234\.568\s+₫/);
    });

    it('should handle undefined and null', () => {
      expect(formatCurrencyForExport(undefined as any)).toMatch(/0\s+₫/);
      expect(formatCurrencyForExport(null as any)).toMatch(/0\s+₫/);
    });
  });

  describe('formatDateForExport', () => {
    it('should format date to DD/MM/YYYY format', () => {
      const date = '2025-11-10T10:00:00Z';
      const formatted = formatDateForExport(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should handle Date objects', () => {
      const date = new Date('2025-11-10');
      const formatted = formatDateForExport(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should handle invalid dates', () => {
      expect(formatDateForExport('invalid-date')).toBe('-');
      expect(formatDateForExport(undefined as any)).toBe('-');
      expect(formatDateForExport(null as any)).toBe('-');
    });
  });

  describe('exportToExcel', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should export data to Excel file', () => {
      const data = [
        { Name: 'Test 1', Value: 100 },
        { Name: 'Test 2', Value: 200 },
      ];
      const filename = 'test-export';
      const sheetName = 'Test Sheet';

      exportToExcel(data, filename, sheetName);

      expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);
      const callArgs = vi.mocked(FileSaver.saveAs).mock.calls[0];
      expect(callArgs[0]).toBeInstanceOf(Blob);
      expect(callArgs[1]).toBe(`${filename}.xlsx`);
    });

    it('should use default sheet name if not provided', () => {
      const data = [{ Test: 'Data' }];
      exportToExcel(data, 'test');

      expect(FileSaver.saveAs).toHaveBeenCalled();
    });

    it('should handle empty data', () => {
      exportToExcel([], 'empty-test');
      expect(FileSaver.saveAs).toHaveBeenCalled();
    });

    it('should create proper filename with extension', () => {
      const data = [{ Test: 'Data' }];
      const filename = 'my-report';

      exportToExcel(data, filename);

      const callArgs = vi.mocked(FileSaver.saveAs).mock.calls[0];
      expect(callArgs[1]).toBe('my-report.xlsx');
    });
  });
});
