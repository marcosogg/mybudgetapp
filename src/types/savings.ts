
export interface MonthlySavingsData {
  month: string;
  amount: number;
  trend_indicator: 'up' | 'down' | 'stable';
  is_negative: boolean;
}

export interface SavingsProjection {
  month: string;
  projected_amount: number;
  confidence_score: number;
}

export interface SavingsChartData {
  monthlyData: MonthlySavingsData[];
  yearTotal: number;
  averageMonthlySavings: number;
  projections: SavingsProjection[];
}
