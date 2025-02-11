
import { LucideIcon } from "lucide-react";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * FeatureItem - A standardized component for displaying features with an icon, title, and description
 * @param {React.ReactNode} icon - The icon to display
 * @param {string} title - The feature title
 * @param {string} description - The feature description
 */
export const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <div className="flex items-start space-x-4">
    <div className="bg-primary/10 p-2 rounded-lg text-primary">{icon}</div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);
