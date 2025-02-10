import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { MonthPicker } from "./MonthPicker";
import { format } from "date-fns";
import { useMonth } from "@/contexts/MonthContext";

export const IncomeSection = () => {
  const { profile, isLoading, updateIncome } = useProfile();
  const { selectedMonth, onMonthChange } = useMonth();
  const [isEditing, setIsEditing] = useState(false);
  const [salary, setSalary] = useState("");
  const [bonus, setBonus] = useState("");

  const handleEdit = () => {
    setSalary(profile?.monthlyIncome?.salary?.toString() || "");
    setBonus(profile?.monthlyIncome?.bonus?.toString() || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateIncome.mutateAsync({
      salary: Number(salary) || 0,
      bonus: Number(bonus) || 0,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const totalIncome = (profile?.monthlyIncome?.salary || 0) + (profile?.monthlyIncome?.bonus || 0);
  const monthLabel = format(selectedMonth, "MMMM yyyy");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Income</CardTitle>
          <MonthPicker
            selectedMonth={selectedMonth}
            onMonthChange={onMonthChange}
          />
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            size="icon"
            onClick={handleEdit}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateIncome.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Monthly Salary</label>
                  <Input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="Enter your monthly salary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Monthly Bonus</label>
                  <Input
                    type="number"
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    placeholder="Enter your monthly bonus"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Salary:</span>
                  <span className="font-medium">${profile?.monthlyIncome?.salary?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Bonus:</span>
                  <span className="font-medium">${profile?.monthlyIncome?.bonus?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <span className="font-medium">Total Monthly Income:</span>
                  <span className="font-bold text-lg">${totalIncome.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
