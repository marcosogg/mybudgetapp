import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GreetingHeader } from "./GreetingHeader";
import { UserAvatar } from "./UserAvatar";

export function DashboardHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <GreetingHeader />
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/transactions/import")}
            variant="outline"
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <UserAvatar />
        </div>
      </div>
    </div>
  );
}