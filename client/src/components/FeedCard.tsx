import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import type { z } from "zod";
import type { api } from "@shared/routes";

// Extract the item type from the API response schema
type FeedItem = z.infer<typeof api.feed.get.responses[200]>[number];

interface FeedCardProps {
  item: FeedItem;
}

const mockTickers = [
  { ticker: "AAPL", change: 1.24 },
  { ticker: "GOOGL", change: -0.87 },
  { ticker: "MSFT", change: 2.15 },
  { ticker: "AMZN", change: -1.32 },
  { ticker: "META", change: 0.95 },
  { ticker: "NFLX", change: -2.41 },
  { ticker: "AMD", change: 3.12 },
  { ticker: "INTC", change: -0.58 },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function FeedCard({ item }: FeedCardProps) {
  const [, setLocation] = useLocation();
  const isSentimentPositive = item.sentimentScore >= 0;
  
  const sentimentColor = isSentimentPositive ? "text-rh-green" : "text-rh-red";
  const SentimentIcon = isSentimentPositive ? TrendingUp : TrendingDown;
  
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a')) return;
    setLocation(`/news/${item.id}`);
  };
  
  const sources = [
    { name: "Bloomberg", color: "bg-blue-600" },
    { name: "Reuters", color: "bg-orange-600" },
    { name: "CNBC", color: "bg-indigo-900" }
  ];

  const seed = item.id;
  const numAdditionalStocks = Math.floor(seededRandom(seed) * 3);
  
  const affectedStocks = [
    { ticker: item.ticker, change: item.stock.dayChangePercent }
  ];
  
  for (let i = 0; i < numAdditionalStocks; i++) {
    const mockIndex = Math.floor(seededRandom(seed + i + 1) * mockTickers.length);
    const mock = mockTickers[mockIndex];
    if (!affectedStocks.find(s => s.ticker === mock.ticker)) {
      affectedStocks.push(mock);
    }
  }

  return (
    <div 
      className="group relative bg-card hover:bg-muted/30 border-b border-border/40 p-5 transition-all duration-200 active:scale-[0.99] cursor-pointer"
      onClick={handleCardClick}
      data-testid={`card-news-${item.id}`}
    >
      <div className="mb-4">
        <h4 className="text-xl leading-tight tracking-tight mb-3 group-hover:text-primary transition-colors font-semibold">
          {item.summaryHeadline}
        </h4>
        
        <div className="flex items-center justify-between gap-2">
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
      <div className="mt-4 flex flex-wrap gap-4">
        {affectedStocks.map((stock) => {
          const isUp = stock.change >= 0;
          return (
            <Link 
              key={stock.ticker}
              href={`/stocks/${stock.ticker}`}
              className="flex items-center text-sm hover:opacity-70 transition-opacity"
              data-testid={`badge-ticker-${stock.ticker}`}
            >
              <span className="font-bold text-foreground mr-1.5">{stock.ticker}</span>
              <span className={cn(
                "flex items-center font-medium",
                isUp ? "text-rh-green" : "text-rh-red"
              )}>
                {isUp ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                )}
                {Math.abs(stock.change).toFixed(2)}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
