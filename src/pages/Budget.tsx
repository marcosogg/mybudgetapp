import { IncomeSection } from "@/components/budget/IncomeSection";
import { BudgetSection } from "@/components/budget/BudgetSection";
import { SavingsSummary } from "@/components/budget/SavingsSummary";
import { MonthPicker } from "@/components/budget/MonthPicker";

const Budget = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Budget Management</h1>
        <MonthPicker />
      </div>

      <div className="grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <IncomeSection />
          <SavingsSummary />
        </div>
        <BudgetSection />
      </div>
    </div>
  );
};

export default Budget;