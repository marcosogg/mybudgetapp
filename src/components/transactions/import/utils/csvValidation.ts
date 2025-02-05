import Papa from 'papaparse';

export const parseCSVFile = (
  file: File,
  onComplete: (results: Papa.ParseResult<string[]>) => void,
  onError: (error: Error) => void
) => {
  Papa.parse<string[]>(file, {
    complete: (results) => {
      // Log the first few rows of raw data
      console.log('Raw CSV data (first 3 rows):', {
        headers: results.data[0],
        sample: results.data.slice(1, 4)
      });
      onComplete(results);
    },
    error: onError,
    // Ensure PapaParse doesn't transform the data
    transform: (value) => value.trim(),
    transformHeader: (header) => header.trim(),
  });
};