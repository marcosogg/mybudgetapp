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
import { Edit2, Trash2, Calendar, Info } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { SavingsGoal } from "../../features/savings/types/savings";

interface SavingsGoalsTableProps {
  goals?: SavingsGoal[];
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (goalId: string) => void;
  isLoading?: boolean;
}

export function SavingsGoalsTable({ 
  goals = [], 
  onEdit, 
  onDelete,
  isLoading = false 
}: SavingsGoalsTableProps) {
  const [goalToDelete, setGoalToDelete] = useState<SavingsGoal | null>(null);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDateInfo = (goal: SavingsGoal) => {
    switch (goal.goal_type) {
      case 'one_time':
        return {
          text: "No date required",
          tooltip: "One-time goals don't require a specific date"
        };
      case 'recurring_monthly':
        return {
          text: goal.period_start ? format(new Date(goal.period_start), "MMMM yyyy") : "Not set",
          tooltip: "Monthly goals start from the beginning of the selected month"
        };
      case 'recurring_yearly':
        return {
          text: format(new Date(), "yyyy"),
          tooltip: "Yearly goals automatically use the current year"
        };
    }
  };

  const getAmountInfo = (goal: SavingsGoal) => {
    switch (goal.goal_type) {
      case 'one_time':
        return {
          text: formatAmount(goal.target_amount),
          tooltip: "Total amount to save"
        };
      case 'recurring_monthly':
        return {
          text: `${formatAmount(goal.recurring_amount || 0)}/month`,
          tooltip: `Monthly contribution towards total goal of ${formatAmount(goal.target_amount)}`
        };
      case 'recurring_yearly':
        return {
          text: `${formatAmount(goal.recurring_amount || 0)}/year`,
          tooltip: `Yearly contribution towards total goal of ${formatAmount(goal.target_amount)}`
        };
    }
  };

  const handleDelete = async (goal: SavingsGoal) => {
    try {
      await onDelete(goal.id);
      toast.success("Goal deleted successfully");
    } catch (error) {
      toast.error("Failed to delete goal");
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Loading savings goals...
      </div>
    );
  }

  if (!goals.length) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        No savings goals found. Create your first goal to get started!
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => {
            const dateInfo = getDateInfo(goal);
            const amountInfo = getAmountInfo(goal);
            
            return (
              <TableRow key={goal.id}>
                <TableCell className="font-medium">{goal.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {goal.goal_type === 'one_time' ? 'One Time' :
                     goal.goal_type === 'recurring_monthly' ? 'Monthly' : 'Yearly'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 cursor-help">
                        {amountInfo.text}
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{amountInfo.tooltip}</TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 cursor-help">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {dateInfo.text}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{dateInfo.tooltip}</TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={goal.progress} className="w-[60px]" />
                    <span className="text-sm text-muted-foreground">
                      {Math.round(goal.progress)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(goal)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this savings goal? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(goal)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
