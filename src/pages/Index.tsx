
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PeriodOverviewCard } from "@/components/dashboard/PeriodOverviewCard";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { UpcomingReminders } from "@/components/reminders/UpcomingReminders";
import { useTransactionStats } from "@/hooks/dashboard/useTransactionStats";
import { useMonth } from "@/contexts/MonthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { selectedMonth } = useMonth();
  const { 
    data: transactionStats, 
    error: transactionError,
    isLoading 
  } = useTransactionStats(selectedMonth);

  if (transactionError) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load transaction statistics. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
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
