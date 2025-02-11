
import { Transaction } from "@/types/transaction";
import { SortField, SortOrder } from "../types";

/**
 * Filter transactions based on search term, category, and tags
 */
export const filterTransactions = (
  transactions: Transaction[],
  searchTerm: string,
  selectedCategory: string,
  selectedTags: string[]
) => {
  let filtered = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedCategory !== "all") {
    filtered = filtered.filter((t) =>
      selectedCategory === "uncategorized"
        ? !t.category_id
        : t.category_id === selectedCategory
    );
  }

  if (selectedTags.length > 0) {
    filtered = filtered.filter((transaction) =>
      selectedTags.every((tag) => transaction.tags?.includes(tag))
    );
  }

  return filtered;
};

/**
 * Sort transactions based on field and order
 */
export const sortTransactions = (
  transactions: Transaction[],
  sortField: SortField,
  sortOrder: SortOrder
) => {
  return [...transactions].sort((a, b) => {
    const multiplier = sortOrder === "asc" ? 1 : -1;
    
    if (sortField === "date") {
      return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    if (sortField === "amount") {
      return multiplier * (a.amount - b.amount);
    }
    if (sortField === "category") {
      const categoryA = a.category?.name ?? "";
      const categoryB = b.category?.name ?? "";
      return multiplier * categoryA.localeCompare(categoryB);
    }
    return multiplier * a[sortField].localeCompare(b[sortField]);
  });
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
