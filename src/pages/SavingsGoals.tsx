
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { SavingsGoalsTable } from "@/components/budget/savings/SavingsGoalsTable";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SavingsGoalDialog } from "@/components/budget/savings/SavingsGoalDialog";

export default function SavingsGoals() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Savings Goals" 
          description="Create and manage your savings goals"
        />
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </Button>
      </div>

      <SavingsGoalsTable />
      
      <SavingsGoalDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode="create"
      />
    </div>
  );
}
