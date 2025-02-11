
import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  categoryName: string | null;
}

/**
 * CategoryBadge - A consistent way to display category labels across the application
 * @param {string | null} categoryName - The name of the category to display
 */
export const CategoryBadge = ({ categoryName }: CategoryBadgeProps) => {
  if (!categoryName) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Uncategorized
      </Badge>
    );
  }

  return <Badge>{categoryName}</Badge>;
};
