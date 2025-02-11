
import { describe, it, expect } from 'vitest';
import {
  calculateTotalBudget,
  calculateRemainingBudget,
  calculateBudgetPercentage,
  formatCurrency
} from '../calculations';
import { Budget } from '@/hooks/budget/types';

/**
 * Test suite for budget calculation utilities
 * Covers core functionality for budget calculations including:
 * - Total budget calculation
 * - Remaining budget calculation
 * - Budget percentage calculation
 * - Currency formatting
 */
describe('Budget Calculations', () => {
  // Mock budget data for testing
  const mockBudgets: Budget[] = [
    { id: '1', category_id: '1', amount: 100, period: '2024-01' },
    { id: '2', category_id: '2', amount: 200, period: '2024-01' },
    { id: '3', category_id: '3', amount: 300, period: '2024-01' },
  ];

  describe('calculateTotalBudget', () => {
    it('calculates total from array of budgets', () => {
      const total = calculateTotalBudget(mockBudgets);
      expect(total).toBe(600);
    });

    it('returns 0 for empty array', () => {
      const total = calculateTotalBudget([]);
      expect(total).toBe(0);
    });

    it('handles undefined input', () => {
      const total = calculateTotalBudget(undefined);
      expect(total).toBe(0);
    });
  });

  describe('calculateRemainingBudget', () => {
    it('calculates remaining budget correctly', () => {
      const remaining = calculateRemainingBudget(600, 1000);
      expect(remaining).toBe(400);
    });

    it('returns negative when budget exceeds income', () => {
      const remaining = calculateRemainingBudget(1000, 500);
      expect(remaining).toBe(-500);
    });
  });

  describe('calculateBudgetPercentage', () => {
    it('calculates percentage correctly', () => {
      const percentage = calculateBudgetPercentage(500, 1000);
      expect(percentage).toBe(50);
    });

    it('returns 0 when income is 0', () => {
      const percentage = calculateBudgetPercentage(500, 0);
      expect(percentage).toBe(0);
    });
  });

  describe('formatCurrency', () => {
    it('formats positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('formats negative numbers correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });
});

