
import { Button } from "@/components/ui/button";
import { Upload, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GreetingHeader } from "./GreetingHeader";
import { QuickInsightsDialog } from "./QuickInsightsDialog";
import { useIntercom } from "@/hooks/useIntercom";

export function DashboardHeader() {
  const navigate = useNavigate();
  const { showMessenger } = useIntercom();

  return (
    <div className="flex flex-col border-b pb-6">
      <div className="container flex justify-between items-center">
        <GreetingHeader />
        <div className="flex items-center gap-3">
          <Button
            onClick={showMessenger}
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <QuickInsightsDialog />
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
    </div>
  );
}
