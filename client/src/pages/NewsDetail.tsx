import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import type { z } from "zod";
import type { api } from "@shared/routes";

type NewsItem = z.infer<typeof api.news.get.responses[200]>;

const mockTickers = [
  { ticker: "AAPL", companyName: "Apple Inc.", price: 178.35, change: 1.24 },
  { ticker: "GOOGL", companyName: "Alphabet Inc.", price: 142.85, change: -0.87 },
  { ticker: "MSFT", companyName: "Microsoft Corp.", price: 378.92, change: 2.15 },
  { ticker: "AMZN", companyName: "Amazon.com", price: 178.25, change: -1.32 },
  { ticker: "META", companyName: "Meta Platforms", price: 485.60, change: 0.95 },
  { ticker: "NFLX", companyName: "Netflix Inc.", price: 485.20, change: -2.41 },
  { ticker: "AMD", companyName: "AMD Inc.", price: 145.80, change: 3.12 },
  { ticker: "INTC", companyName: "Intel Corp.", price: 42.50, change: -0.58 },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateChartData(isPositive: boolean, seed: number) {
  const points = [];
  let value = 50;
  for (let i = 0; i < 30; i++) {
    const rand = seededRandom(seed + i);
    value += (rand - (isPositive ? 0.4 : 0.6)) * 4;
    value = Math.max(20, Math.min(80, value));
    points.push(value);
  }
  return points;
}

function MiniStockChart({ isPositive, seed }: { isPositive: boolean; seed: number }) {
  const data = generateChartData(isPositive, seed);
  const color = isPositive ? "#00C805" : "#FF5000";
  
  const pathD = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - val;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-16 h-10">
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function NewsDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/news/:id");
  const newsId = parseInt(params?.id || "1", 10);

  const { data: news, isLoading, error } = useQuery<NewsItem>({
    queryKey: ['/api/news', newsId],
  });

  const sources = [
    { name: "Bloomberg", color: "bg-blue-600" },
    { name: "Reuters", color: "bg-orange-600" },
    { name: "CNBC", color: "bg-indigo-900" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center justify-between px-4 py-3">
          <div className="w-9" />
          <h1 className="text-sm font-medium text-muted-foreground">News</h1>
          <Button size="icon" variant="ghost" onClick={() => setLocation("/")} data-testid="button-back">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </header>
        <div className="px-5 py-8 text-center text-muted-foreground">
          News item not found
        </div>
      </div>
    );
  }

  const isBullish = news.sentimentScore >= 0;

  const affectedStocks = [
    { 
      ticker: news.ticker, 
      companyName: news.stock.companyName, 
      price: news.stock.currentPrice, 
      change: news.stock.dayChangePercent 
    }
  ];

  const numAdditional = Math.floor(seededRandom(newsId) * 3) + 1;
  for (let i = 0; i < numAdditional; i++) {
    const mockIndex = Math.floor(seededRandom(newsId + i + 100) * mockTickers.length);
    const mock = mockTickers[mockIndex];
    if (!affectedStocks.find(s => s.ticker === mock.ticker)) {
      affectedStocks.push(mock);
    }
  }

  return (
    <div className="pb-20">
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4">
        <header className="flex items-center justify-start px-4 py-3 sticky top-0 bg-background z-50">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </header>
        <main className="px-5">
        <div className={cn(
          "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-secondary mb-3",
          isBullish ? "text-rh-green" : "text-rh-red"
        )}>
          {isBullish ? <TrendingUp className="w-3 h-3 mr-1.5" /> : <TrendingDown className="w-3 h-3 mr-1.5" />}
          {isBullish ? "Bullish" : "Bearish"}
        </div>

        <h2 className="text-2xl font-bold leading-tight mb-4" data-testid="text-headline">
          {news.summaryHeadline}
        </h2>

        <Link 
          href={`/news/${newsId}/sources`}
          className="flex items-center gap-1.5 mb-6 hover:opacity-70 transition-opacity cursor-pointer"
          data-testid="link-sources"
        >
          <div className="flex items-center -space-x-2">
            {sources.map((source, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[8px] font-bold text-white shadow-sm",
                  source.color
                )}
                title={source.name}
              >
                {source.name[0]}
              </div>
            ))}
          </div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            {news.sourceCount}+ Sources
          </span>
        </Link>

        <div className="mb-8">
          <p className="text-base leading-relaxed text-foreground" data-testid="text-summary">
            {news.summaryHeadline} Multiple sources are reporting on this development, 
            with analysts indicating a {isBullish ? "positive" : "cautious"} outlook. 
            The market response has been {isBullish ? "favorable" : "mixed"}, 
            as investors assess the potential implications across the {news.stock.sector} sector and related industries.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Relevant Stocks</h3>
          <div className="flex flex-col divide-y divide-border/40">
            {affectedStocks.map((stock, index) => {
              const isUp = stock.change >= 0;
              return (
                <Link
                  key={stock.ticker}
                  href={`/stocks/${stock.ticker}`}
                  className="flex items-center justify-between py-4 hover:bg-muted/30 -mx-2 px-2 rounded-md transition-colors"
                  data-testid={`link-stock-${stock.ticker}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground" data-testid={`text-ticker-${stock.ticker}`}>
                      {stock.ticker}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {stock.companyName}
                    </p>
                  </div>
                  
                  <div>
                    <MiniStockChart isPositive={isUp} seed={newsId + index} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
