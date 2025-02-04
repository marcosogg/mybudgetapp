import { IncomeSection } from "@/components/budget/IncomeSection";
import { BudgetSection } from "@/components/budget/BudgetSection";
import { SavingsSummary } from "@/components/budget/SavingsSummary";

const Budget = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Budget Management</h1>
      </div>

      <div className="grid gap-6">
        <IncomeSection />
        <SavingsSummary />
        <BudgetSection />
      </div>
    </div>
  );
};

export default Budget;