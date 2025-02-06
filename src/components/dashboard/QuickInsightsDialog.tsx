import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, ArrowRight } from "lucide-react"
import { useAIInsights } from "@/hooks/useAIInsights"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface InsightSectionProps {
  title: string;
  children: React.ReactNode;
}

const InsightSection = ({ title, children }: InsightSectionProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
    {children}
  </div>
);

interface InsightCardProps {
  type: 'positive' | 'negative' | 'warning';
  content: string;
}

const InsightCard = ({ type, content }: InsightCardProps) => {
  const icons = {
    positive: <TrendingUp className="h-4 w-4 text-green-500" />,
    negative: <TrendingDown className="h-4 w-4 text-destructive" />,
    warning: <AlertCircle className="h-4 w-4 text-yellow-500" />
  };

  const backgrounds = {
    positive: 'bg-green-50 dark:bg-green-950/30',
    negative: 'bg-red-50 dark:bg-red-950/30',
    warning: 'bg-yellow-50 dark:bg-yellow-950/30'
  };

  return (
    <Card className={cn("p-4", backgrounds[type])}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5">{icons[type]}</span>
        <p className="text-sm leading-tight">{content}</p>
      </div>
    </Card>
  );
};

export function QuickInsightsDialog() {
  const { insights, isLoading, refreshInsights } = useAIInsights()

  // Helper function to determine insight type
  const getInsightType = (content: string): 'positive' | 'negative' | 'warning' => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('under budget') || lowerContent.includes('savings')) {
      return 'positive';
    }
    if (lowerContent.includes('over budget') || lowerContent.includes('attention') || lowerContent.includes('consider')) {
      return 'negative';
    }
    return 'warning';
  };

  // Parse insights into sections
  const parseInsights = (text: string) => {
    const sections = text.split(/\d+\.\s/).filter(Boolean);
    return sections.map(section => {
      const [title, ...content] = section.split('\n').filter(Boolean);
      return {
        title: title.trim(),
        content: content.map(item => item.trim()).filter(Boolean)
      };
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={refreshInsights}
        >
          <Lightbulb className="h-4 w-4" />
          Quick Insights
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Quick Insights
          </DialogTitle>
          <DialogDescription>
            AI-powered analysis of your budget and spending patterns
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] mt-4 pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : insights ? (
            <div className="space-y-8">
              {parseInsights(insights).map((section, index) => (
                <div key={index} className="space-y-4">
                  <InsightSection title={section.title}>
                    <div className="grid gap-4">
                      {section.content.map((insight, i) => (
                        <InsightCard
                          key={i}
                          content={insight}
                          type={getInsightType(insight)}
                        />
                      ))}
                    </div>
                  </InsightSection>
                  {index < parseInsights(insights).length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No insights available. Click the refresh button to generate new insights.
              </AlertDescription>
            </Alert>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 