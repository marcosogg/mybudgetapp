
import { Transaction } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SavingsGoal } from "@/types/savings";

interface SavingsGoalTransactionsProps {
  goal: SavingsGoal;
}

export function SavingsGoalTransactions({ goal }: SavingsGoalTransactionsProps) {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['savings-transactions', goal.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          category:categories(name)
        `)
        .eq("user_id", user.id)
        .eq("savings_goal_id", goal.id)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    }
  });

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  if (!transactions?.length) {
    return <div className="text-muted-foreground text-sm">No transactions found for this savings goal.</div>;
  }

  const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Contributing Transactions</h3>
        <div className="text-sm text-muted-foreground">
          Total Contribution: ${totalAmount.toLocaleString()}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category?.name}</TableCell>
                <TableCell>${Math.abs(transaction.amount).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
