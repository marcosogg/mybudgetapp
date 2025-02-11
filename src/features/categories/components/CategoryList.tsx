
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "../hooks/useCategories";
import { CategoryListItem } from "./CategoryListItem";

export function CategoryList() {
  const { categories, isLoading, deleteCategory } = useCategories();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 w-full animate-pulse bg-muted rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <CategoryListItem
              key={category.id}
              category={category}
              onDelete={() => deleteCategory.mutate(category.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
