import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronRight, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Settings() {
  const { profile, updateIncome } = useProfile();
  const navigate = useNavigate();
  const [showFormatDialog, setShowFormatDialog] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<"revolut" | "wise" | null>(null);
  const [name, setName] = useState(profile?.name || "");

  const handleFormatChange = async (format: "revolut" | "wise") => {
    setPendingFormat(format);
    setShowFormatDialog(true);
  };

  const handleConfirmFormatChange = async () => {
    if (!pendingFormat) return;

    try {
      await updateIncome.mutateAsync({
        salary: profile?.monthlyIncome?.salary || 0,
        bonus: profile?.monthlyIncome?.bonus || 0,
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setShowFormatDialog(false);
      setPendingFormat(null);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateIncome.mutateAsync({
        salary: profile?.monthlyIncome?.salary || 0,
        bonus: profile?.monthlyIncome?.bonus || 0,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div>
          <h2 className="text-base font-semibold mb-4">Profile</h2>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-muted-foreground">Your display name</div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleUpdateProfile}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-px bg-border mt-6" />
        </div>

        {/* Categories Section */}
        <div>
          <h2 className="text-base font-semibold mb-4">Categories</h2>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between py-2 px-0 h-auto hover:bg-transparent"
            onClick={() => navigate("/categories")}
          >
            <div className="text-left">
              <div className="font-medium">Manage categories</div>
              <div className="text-sm text-muted-foreground">
                Manage your transaction categories and budgeting rules
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
          <div className="h-px bg-border mt-6" />
        </div>

        {/* Reminders Section */}
        <div>
          <h2 className="text-base font-semibold mb-4">Reminders</h2>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between py-2 px-0 h-auto hover:bg-transparent"
            onClick={() => navigate("/reminders")}
          >
            <div className="text-left">
              <div className="font-medium">Configure reminders</div>
              <div className="text-sm text-muted-foreground">
                Set up and manage your financial reminders and notifications
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
          <div className="h-px bg-border mt-6" />
        </div>

        {/* Statement Format Section */}
        <div>
          <h2 className="text-base font-semibold mb-4">Statement Format</h2>
          <RadioGroup
            defaultValue={profile?.statement_format || "revolut"}
            onValueChange={handleFormatChange}
            className="space-y-4"
          >
            <div className="flex items-start space-x-4">
              <RadioGroupItem value="revolut" id="revolut" className="mt-1" />
              <Label htmlFor="revolut" className="flex-1 cursor-pointer">
                <div className="font-medium">Revolut</div>
                <div className="text-sm text-muted-foreground">
                  Format: Date, Description, Amount
                </div>
              </Label>
            </div>
            <div className="flex items-start space-x-4">
              <RadioGroupItem value="wise" id="wise" className="mt-1" />
              <Label htmlFor="wise" className="flex-1 cursor-pointer">
                <div className="font-medium">Wise</div>
                <div className="text-sm text-muted-foreground">
                  Format: Date, Amount, Description
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <AlertDialog open={showFormatDialog} onOpenChange={setShowFormatDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Statement Format?</AlertDialogTitle>
            <AlertDialogDescription>
              This will change how your CSV files are processed during import.
              Make sure your future statement downloads match the selected format.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowFormatDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmFormatChange}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
