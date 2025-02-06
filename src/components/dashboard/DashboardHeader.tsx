import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GreetingHeader } from "./GreetingHeader";

export function DashboardHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col border-b pb-6">
      <div className="container flex justify-between items-center">
        <GreetingHeader />
        <div className="flex items-center gap-3">
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
