
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, FileUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TransactionManagementProps {
  transactionCount: number | null;
}

export function TransactionManagement({ transactionCount }: TransactionManagementProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Transaction Management</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Transactions</span>
          <span className="text-2xl font-bold">{transactionCount ?? 0}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            className="w-full" 
            variant="default"
            onClick={() => navigate("/transactions")}
          >
            View All
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => navigate("/transactions/import")}
          >
            Import CSV
            <FileUp className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
