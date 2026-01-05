import { ArrowUpRight, ArrowDownRight, Newspaper, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
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
  
  return (
    <div className="group relative bg-card hover:bg-muted/30 border-b border-border/40 p-5 transition-all duration-200 active:scale-[0.99]">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm",
            isPositive ? "bg-rh-green-subtle text-rh-green" : "bg-rh-red-subtle text-rh-red"
          )}>
            {item.ticker.substring(0, 2)}
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-foreground">
              {item.ticker}
            </h3>
            <p className="text-xs text-muted-foreground font-medium truncate max-w-[120px]">
              {item.stock.companyName}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-mono font-medium text-sm">
            ${item.stock.currentPrice.toFixed(2)}
          </div>
          <div className={cn(
            "flex items-center justify-end text-xs font-semibold mt-0.5",
            isPositive ? "text-rh-green" : "text-rh-red"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {Math.abs(item.stock.dayChangePercent).toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-lg font-bold leading-snug tracking-tight mb-2 group-hover:text-primary transition-colors">
          {item.summaryHeadline}
        </h4>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <span className="flex items-center font-medium text-foreground/80">
              <Newspaper className="w-3 h-3 mr-1.5" />
              {item.primarySourceName}
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-border" />
            <span>
              {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
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
    </div>
  );
}
