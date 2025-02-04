import Papa from 'papaparse';

export const REVOLUT_HEADERS = [
  'Type', 'Product', 'Started Date', 'Completed Date', 
  'Description', 'Amount', 'Fee', 'Currency', 'State', 'Balance'
];

export const validateHeaders = (headers: string[], expectedHeaders: string[]): boolean => {
  return expectedHeaders.every((header, index) => headers[index] === header);
};

export const formatDate = (dateStr: string): string | null => {
  if (!dateStr?.trim()) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
};

export const parseCSVFile = (
  file: File,
  onComplete: (results: Papa.ParseResult<string[]>) => void,
  onError: (error: Error) => void
) => {
  Papa.parse<string[]>(file, {
    complete: onComplete,
    error: onError,
  });
};