import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
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
        salary: profile?.salary || 0,
        bonus: profile?.bonus || 0,
        statement_format: pendingFormat,
        name: name,
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
        salary: profile?.salary || 0,
        bonus: profile?.bonus || 0,
        statement_format: profile?.statement_format || "revolut",
        name: name,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancelFormatChange = () => {
    setShowFormatDialog(false);
    setPendingFormat(null);
  };

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      <div className="flex items-center gap-4">
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

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <Button onClick={handleUpdateProfile}>
            Update Profile
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Statement Format</h2>
        <RadioGroup
          defaultValue={profile?.statement_format || "revolut"}
          onValueChange={handleFormatChange}
          className="grid gap-4"
        >
          <div className="flex items-center space-x-4 rounded-lg border p-4">
            <RadioGroupItem value="revolut" id="revolut" />
            <Label htmlFor="revolut" className="flex-1">
              <div className="font-semibold mb-1">Revolut</div>
              <div className="text-sm text-muted-foreground">
                Format: Date, Description, Amount
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-4 rounded-lg border p-4">
            <RadioGroupItem value="wise" id="wise" />
            <Label htmlFor="wise" className="flex-1">
              <div className="font-semibold mb-1">Wise</div>
              <div className="text-sm text-muted-foreground">
                Format: Date, Amount, Description
              </div>
            </Label>
          </div>
        </RadioGroup>
      </Card>

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
            <AlertDialogCancel onClick={handleCancelFormatChange}>
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