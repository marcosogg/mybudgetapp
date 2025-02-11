
import { DollarSign, PieChart, Wallet } from "lucide-react";
import { FeatureItem } from "../shared/FeatureItem";

export const Features = () => {
  return (
    <div className="space-y-4">
      <FeatureItem
        icon={<DollarSign className="w-6 h-6" />}
        title="Track Expenses"
        description="Import and categorize your transactions automatically"
      />
      <FeatureItem
        icon={<PieChart className="w-6 h-6" />}
        title="Visual Insights"
        description="See where your money goes with beautiful charts"
      />
      <FeatureItem
        icon={<Wallet className="w-6 h-6" />}
        title="Budget Management"
        description="Set and track budgets for different categories"
      />
    </div>
  );
};
