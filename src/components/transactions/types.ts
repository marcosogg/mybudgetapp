
/**
 * Available fields for sorting transactions
 * @typedef {string} SortField
 */
export type SortField = "date" | "description" | "amount" | "category";

/**
 * Sort order direction
 * @typedef {string} SortOrder
 */
export type SortOrder = "asc" | "desc";

/**
 * Memoization helper for transaction components
 * Compares props to determine if a re-render is needed
 * @param prevProps Previous component props
 * @param nextProps Next component props
 * @returns Boolean indicating if props are equal
 */
export const areTransactionPropsEqual = <T extends Record<string, any>>(
  prevProps: T,
  nextProps: T
): boolean => {
  return Object.keys(prevProps).every((key) => {
    // Deep comparison for arrays
    if (Array.isArray(prevProps[key])) {
      return JSON.stringify(prevProps[key]) === JSON.stringify(nextProps[key]);
    }
    // Simple comparison for primitives
    return prevProps[key] === nextProps[key];
  });
};

