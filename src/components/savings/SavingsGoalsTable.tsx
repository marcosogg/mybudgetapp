
import { useQuery } from "@tanstack/react-query";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SavingsGoal } from "@/types/savings";

export function SavingsGoalsTable() {
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null);

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

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from("savings_goals")
        .delete()
        .eq("id", goalId);

      if (error) throw error;
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
            <TableHead>Name</TableHead>
            <TableHead>Target Amount</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals?.map((goal) => (
            <TableRow key={goal.id}>
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
                  <Progress value={goal.progress || 0} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {goal.progress?.toFixed(1)}% Complete
                  </p>
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
