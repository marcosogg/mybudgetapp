
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { TransactionManagement } from "@/components/dashboard/TransactionManagement";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <ChartsSection />
      <TransactionManagement />
    </div>
  );
}
