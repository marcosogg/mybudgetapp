import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Your financial overview
        </p>
      </div>
      <Button
        onClick={() => navigate("/transactions/import")}
        variant="outline"
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        Import CSV
      </Button>
    </div>
  );
}