import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PeriodOverviewCard } from "@/components/dashboard/PeriodOverviewCard";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { UpcomingReminders } from "@/components/reminders/UpcomingReminders";
import { useTransactionStats } from "@/hooks/dashboard/useTransactionStats";
import { useMonth } from "@/contexts/MonthContext";

const Index = () => {
  const { selectedMonth } = useMonth();
  const { data: transactionStats, error: transactionError } = useTransactionStats(selectedMonth);

  if (transactionError) {
    console.error('Transaction query error:', transactionError);
  }

  return (
    <div className="space-y-8">
      <DashboardHeader />
      
      <PeriodOverviewCard
        transactionCount={transactionStats?.count || 0}
        transactionTotal={transactionStats?.total || 0}
      />

      <ChartsSection />

      <UpcomingReminders />
    </div>
  );
};

export default Index;