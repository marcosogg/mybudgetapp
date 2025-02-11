
import { Button } from "@/components/ui/button";
import { Target, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GreetingHeader } from "./GreetingHeader";
import { QuickInsightsDialog } from "./QuickInsightsDialog";
import { useState } from "react";
import { SimpleGoalDialog } from "../savings/SimpleGoalDialog";

export function DashboardHeader() {
  const navigate = useNavigate();
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);

  return (
    <div className="flex flex-col border-b pb-6">
      <div className="container flex justify-between items-center">
        <GreetingHeader />
        <div className="flex items-center gap-3">
          <QuickInsightsDialog />
          <Button
            onClick={() => setIsGoalDialogOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Target className="h-4 w-4" />
            Set Goal
          </Button>
          <Button
            onClick={() => navigate("/transactions/import")}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </div>
      <SimpleGoalDialog 
        open={isGoalDialogOpen} 
        onOpenChange={setIsGoalDialogOpen} 
      />
    </div>
  );
}
