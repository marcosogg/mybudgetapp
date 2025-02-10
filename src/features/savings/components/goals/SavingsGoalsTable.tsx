import { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { SavingsService } from "../../api/service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SAVINGS_QUERY_KEYS } from "../../hooks/useSavings";
import type { SavingsGoal } from "../../types/savings";
import { SavingsGoalDialog } from "./SavingsGoalDialog";

export function SavingsGoalsTable() {
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null);
  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useQuery({
    queryKey: SAVINGS_QUERY_KEYS.state,
    select: (state) => state.goals,
  });

  const deleteGoal = async (goalId: string) => {
    try {
      await SavingsService.getInstance().deleteGoal(goalId);
      await queryClient.invalidateQueries({ queryKey: SAVINGS_QUERY_KEYS.state });
      toast.success("Goal deleted successfully");
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
              <TableCell>
                <Badge variant="outline">
                  {goal.type === 'one_time' ? 'One Time' :
                   goal.type === 'recurring_monthly' ? 'Monthly' : 'Yearly'}
                </Badge>
              </TableCell>
              <TableCell>
                ${goal.targetAmount.toLocaleString()}
                {goal.recurringAmount && (
                  <span className="text-sm text-muted-foreground">
                    {' '}(${goal.recurringAmount.toLocaleString()}/
                    {goal.type === 'recurring_monthly' ? 'month' : 'year'})
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{format(goal.periodStart, 'MMM d, yyyy')}</div>
                  {goal.periodEnd && (
                    <div className="text-muted-foreground">
                      to {format(goal.periodEnd, 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="w-[200px] space-y-1">
                  <Progress value={goal.progress || 0} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {goal.progress?.toFixed(1)}% Complete
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={goal.periodEnd ? "secondary" : "default"}>
                  {goal.periodEnd ? "Completed" : "Active"}
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
                          onClick={() => deleteGoal(goal.id)}
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