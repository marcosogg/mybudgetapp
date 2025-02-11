
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
}

interface CategoryStatsProps {
  categories: Category[];
}

/**
 * CategoryStats - A component for displaying category statistics
 * @param {Category[]} categories - Array of categories to display stats for
 */
export function CategoryStats({ categories }: CategoryStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{categories.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}
