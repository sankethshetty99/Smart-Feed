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
            <span className="ml-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
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

      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] shadow-sm",
              isPositive ? "bg-rh-green-subtle text-rh-green" : "bg-rh-red-subtle text-rh-red"
            )}>
              {item.ticker}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground leading-none mb-1">
                {item.ticker}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[150px]">
                {item.stock.companyName}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-mono font-bold text-xs">
              ${item.stock.currentPrice.toFixed(2)}
            </div>
            <div className={cn(
              "flex items-center justify-end text-[10px] font-bold mt-0.5",
              isPositive ? "text-rh-green" : "text-rh-red"
            )}>
              {isPositive ? <ArrowUpRight className="w-2 h-2 mr-0.5" /> : <ArrowDownRight className="w-2 h-2 mr-0.5" />}
              {Math.abs(item.stock.dayChangePercent).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
