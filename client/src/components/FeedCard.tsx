import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { z } from "zod";
import type { api } from "@shared/routes";

// Extract the item type from the API response schema
type FeedItem = z.infer<typeof api.feed.get.responses[200]>[number];

interface FeedCardProps {
  item: FeedItem;
}

export function FeedCard({ item }: FeedCardProps) {
  const isPositive = item.stock.dayChangePercent >= 0;
  const isSentimentPositive = item.sentimentScore >= 0;
  
  // Determine sentiment intensity
  const sentimentColor = isSentimentPositive ? "text-rh-green" : "text-rh-red";
  const SentimentIcon = isSentimentPositive ? TrendingUp : TrendingDown;
  
  // Mock source logos since we don't have real ones yet
  const sources = [
    { name: "Bloomberg", color: "bg-blue-600" },
    { name: "Reuters", color: "bg-orange-600" },
    { name: "CNBC", color: "bg-indigo-900" }
  ];

  return (
    <div className="group relative bg-card hover:bg-muted/30 border-b border-border/40 p-5 transition-all duration-200 active:scale-[0.99]">
      <div className="mb-4">
        <h4 className="text-xl font-bold leading-tight tracking-tight mb-3 group-hover:text-primary transition-colors">
          {item.summaryHeadline}
        </h4>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center -space-x-2">
              {sources.map((source, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-[8px] font-bold text-white shadow-sm",
                    source.color
                  )}
                  title={source.name}
                >
                  {source.name[0]}
                </div>
              ))}
            </div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {item.sourceCount}+ Sources
            </span>
          </div>

          <div className={cn(
            "flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-secondary",
            sentimentColor
          )}>
            <SentimentIcon className="w-3 h-3 mr-1.5" />
            {isSentimentPositive ? "Bullish" : "Bearish"}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <div 
          className="flex items-center text-sm"
          data-testid={`badge-ticker-${item.ticker}`}
        >
          <span className="font-bold text-foreground mr-1.5">{item.ticker}</span>
          <span className={cn(
            "flex items-center font-medium",
            isPositive ? "text-rh-green" : "text-rh-red"
          )}>
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            )}
            {Math.abs(item.stock.dayChangePercent).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
