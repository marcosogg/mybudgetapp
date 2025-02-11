
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SortField = "date" | "description" | "amount" | "category";

interface TransactionTableHeaderProps {
  toggleSort: (field: SortField) => void;
}

export const TransactionTableHeader = ({ toggleSort }: TransactionTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => toggleSort("date")}
            className="flex items-center gap-2"
          >
            Date
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => toggleSort("description")}
            className="flex items-center gap-2"
          >
            Description(Vendor)
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => toggleSort("category")}
            className="flex items-center gap-2"
          >
            Category
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => toggleSort("amount")}
            className="flex items-center gap-2"
          >
            Amount
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>Tags</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
