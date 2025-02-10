import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { SavingsGoalDialog } from "./SavingsGoalDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSavings } from "@/features/savings/hooks/useSavings";
import { toast } from "sonner";
import type { SavingsGoal } from "@/features/savings/types/savings";

export function SavingsGoalsTable() {
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null);
  const { goals, isLoadingGoals, deleteGoal } = useSavings();

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal.mutateAsync(goalId);
      toast.success("Goal deleted successfully");
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  if (isLoadingGoals) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Target Amount</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals?.map((goal) => (
            <TableRow key={goal.id}>
              <TableCell>{goal.name}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {goal.goal_type === 'one_time' ? 'One Time' : 'Recurring'}
                </Badge>
              </TableCell>
              <TableCell>
                ${goal.target_amount.toLocaleString()}
                {goal.recurring_amount && (
                  <span className="text-sm text-muted-foreground">
                    {' '}(${goal.recurring_amount.toLocaleString()}/month)
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{format(new Date(goal.period_start), 'MMM d, yyyy')}</div>
                  {goal.period_end && (
                    <div className="text-muted-foreground">
                      to {format(new Date(goal.period_end), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="w-[200px] space-y-1">
                  <Progress value={goal.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {goal.progress.toFixed(1)}% Complete
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={goal.period_end ? "secondary" : "default"}>
                  {goal.period_end ? "Completed" : "Active"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditGoal(goal)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Savings Goal</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this savings goal? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SavingsGoalDialog
        open={!!editGoal}
        onOpenChange={(open) => !open && setEditGoal(null)}
        mode="edit"
        goal={editGoal}
      />
    </div>
  );
}
