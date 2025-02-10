
import { render, screen } from '@testing-library/react';
import { SavingsChart } from '../SavingsChart';
import { useSavingsData } from '../hooks/useSavingsData';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock the custom hook
vi.mock('../hooks/useSavingsData');
const mockUseSavingsData = vi.mocked(useSavingsData);

describe('SavingsChart', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('renders loading skeleton when data is loading', () => {
    mockUseSavingsData.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    render(<SavingsChart />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders chart with data when loaded', () => {
    const mockData = {
      monthlyData: [
        {
          month: 'Jan',
          amount: 1000,
          goal_amount: 500,
          percentage_of_goal: 200,
          trend_indicator: 'up' as const,
          is_negative: false,
        },
      ],
      yearTotal: 1000,
      currentGoal: {
        id: '1',
        user_id: '1',
        target_amount: 6000,
        start_date: '2024-01-01',
        end_date: null,
        created_at: '2024-01-01',
      },
      projections: [
        {
          month: 'Feb',
          projected_amount: 1100,
          confidence_score: 0.8,
        },
      ],
      averageMonthlySavings: 1000,
      goalProgress: 16.67,
    };

    mockUseSavingsData.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    } as any);

    render(<SavingsChart />);
    
    // Check for main elements
    expect(screen.getByText('Monthly Savings')).toBeInTheDocument();
    expect(screen.getByText('Track your savings progress')).toBeInTheDocument();
    expect(screen.getByText('16.7% of Goal')).toBeInTheDocument();
    
    // Check for metrics cards
    expect(screen.getByText('Year to Date')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
    expect(screen.getByText('Monthly Average')).toBeInTheDocument();
  });

  it('handles error state gracefully', () => {
    mockUseSavingsData.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load data'),
    } as any);

    render(<SavingsChart />);
    // Add appropriate error state checks based on your error handling UI
  });
});
