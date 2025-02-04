import Papa from 'papaparse';

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