
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useState } from "react";
import { SavingsGoalDialog } from "./SavingsGoalDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SavingsGoal } from "@/types/savings";
import { SavingsGoalTransactions } from "./SavingsGoalTransactions";

export function SavingsGoalsTable() {
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useQuery({
    queryKey: ['savings-goals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SavingsGoal[];
    }
  });

  const deleteGoal = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from("savings_goals")
        .delete()
        .eq("id", goalId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      toast.success("Goal deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const toggleTransactions = (goalId: string) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Goal</TableHead>
            <TableHead>Target Amount</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals?.map((goal) => (
            <>
              <TableRow 
                key={goal.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => toggleTransactions(goal.id)}
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{goal.name}</p>
                    {goal.notes && (
                      <p className="text-sm text-muted-foreground">{goal.notes}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  ${goal.target_amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="w-[200px] space-y-1">
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${(goal.target_amount * (goal.progress / 100)).toLocaleString()}</span>
                      <span>{goal.progress.toFixed(1)}%</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(goal.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditGoal(goal);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                        >
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
                            onClick={() => deleteGoal.mutate(goal.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
              {expandedGoalId === goal.id && (
                <TableRow>
                  <TableCell colSpan={5} className="bg-muted/50">
                    <SavingsGoalTransactions goal={goal} />
                  </TableCell>
                </TableRow>
              )}
            </>
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
