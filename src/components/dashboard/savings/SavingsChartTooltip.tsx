import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TooltipProps } from "recharts";
import type { TrendIndicator } from "./utils/calculations";

interface TooltipData {
  month: string;
  amount: number;
  trend_indicator?: TrendIndicator;
  projected_amount?: number;
  confidence_score?: number;
  is_projection?: boolean;
}

export function SavingsChartTooltip({ 
  active, 
  payload,
  goalAmount = 0
}: TooltipProps & { goalAmount?: number }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as TooltipData;
  
  return (
    <Card className="p-3 space-y-2 border-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{data.month}</p>
        {data.trend_indicator && (
          <Badge variant={
            data.trend_indicator === 'up' ? 'default' :
            data.trend_indicator === 'down' ? 'destructive' : 
            'secondary'
          }>
            {data.trend_indicator === 'up' ? '↑' :
             data.trend_indicator === 'down' ? '↓' : '→'}
          </Badge>
        )}
      </div>
      {data.is_projection ? (
        <div className="space-y-1">
          <p className="text-sm">
            Projected: ${data.projected_amount?.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            Confidence: {(data.confidence_score! * 100).toFixed(0)}%
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-sm">
            Saved: ${data.amount.toLocaleString()}
          </p>
          {goalAmount > 0 && (
            <>
              <p className="text-xs text-muted-foreground">
                Monthly Goal: ${goalAmount.toLocaleString()}
              </p>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all"
                  style={{ 
                    width: `${Math.min(100, (data.amount / goalAmount) * 100)}%`
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
} 