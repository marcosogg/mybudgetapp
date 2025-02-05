import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useProfile } from "@/hooks/useProfile";

export function DashboardHeader() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const { profile, isLoading } = useProfile();

  const handleImportClick = () => {
    if (!profile?.statement_format) {
      navigate("/settings");
      return;
    }
    setShowDialog(true);
  };

  const handleConfirm = () => {
    setShowDialog(false);
    navigate("/transactions/import");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Your financial overview
        </p>
      </div>
      <Button
        onClick={handleImportClick}
        variant="outline"
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        Import CSV
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Statement</AlertDialogTitle>
            <AlertDialogDescription>
              You are importing a {profile?.statement_format?.toUpperCase()} statement.
              Make sure your CSV file matches this format.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}