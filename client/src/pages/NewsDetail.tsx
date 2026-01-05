import { useRoute, useLocation } from "wouter";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const mockNewsData: Record<number, {
  id: number;
  headline: string;
  sentiment: "bullish" | "bearish";
  sourceCount: number;
  summary: string;
  affectedStocks: Array<{
    ticker: string;
    companyName: string;
    price: number;
    change: number;
  }>;
}> = {
  1: {
    id: 1,
    headline: "Fed Signals Potential Rate Cuts Amid Cooling Inflation Data",
    sentiment: "bullish",
    sourceCount: 12,
    summary: "The Federal Reserve indicated it may begin cutting interest rates in the coming months as inflation continues to moderate. Multiple Fed officials expressed confidence that price pressures are easing, potentially paving the way for monetary policy easing. Markets responded positively to the news, with financial stocks leading gains.",
    affectedStocks: [
      { ticker: "JPM", companyName: "JPMorgan Chase", price: 195.40, change: 2.15 },
      { ticker: "BAC", companyName: "Bank of America", price: 34.25, change: 1.87 },
      { ticker: "GS", companyName: "Goldman Sachs", price: 385.60, change: 2.45 },
      { ticker: "MS", companyName: "Morgan Stanley", price: 92.30, change: 1.92 },
    ],
  },
  2: {
    id: 2,
    headline: "New Export Controls Spark Uncertainty in Semiconductor Supply Chains",
    sentiment: "bearish",
    sourceCount: 8,
    summary: "Recent government announcements regarding export restrictions on advanced semiconductor technology have created uncertainty in global chip supply chains. Industry analysts warn that these controls could impact production timelines and increase costs for major chipmakers. The news sent semiconductor stocks lower in afternoon trading.",
    affectedStocks: [
      { ticker: "NVDA", companyName: "NVIDIA Corp", price: 875.20, change: -1.50 },
      { ticker: "AMD", companyName: "Advanced Micro", price: 145.80, change: -0.87 },
      { ticker: "INTC", companyName: "Intel Corp", price: 42.50, change: -0.58 },
      { ticker: "TSM", companyName: "Taiwan Semi", price: 142.85, change: -1.23 },
    ],
  },
  3: {
    id: 3,
    headline: "Major Tech Acquisitions Reshape Cloud Computing Landscape",
    sentiment: "bullish",
    sourceCount: 15,
    summary: "A wave of strategic acquisitions in the cloud computing sector is reshaping competitive dynamics. Major tech giants are expanding their infrastructure capabilities through targeted purchases, signaling continued growth in enterprise cloud services. Analysts expect this consolidation trend to benefit established players.",
    affectedStocks: [
      { ticker: "MSFT", companyName: "Microsoft Corp", price: 378.92, change: 2.18 },
      { ticker: "AMZN", companyName: "Amazon.com", price: 178.25, change: 1.45 },
      { ticker: "GOOGL", companyName: "Alphabet Inc", price: 142.85, change: 1.32 },
      { ticker: "CRM", companyName: "Salesforce", price: 265.40, change: 1.78 },
    ],
  },
  4: {
    id: 4,
    headline: "Electric Vehicle Demand Surges as Battery Costs Continue to Fall",
    sentiment: "bullish",
    sourceCount: 10,
    summary: "Global electric vehicle sales have reached record levels as declining battery costs make EVs more accessible to mainstream consumers. Industry data shows battery pack prices have fallen significantly over the past year, improving profit margins for automakers and enabling more competitive pricing.",
    affectedStocks: [
      { ticker: "TSLA", companyName: "Tesla Inc", price: 248.50, change: 3.20 },
      { ticker: "RIVN", companyName: "Rivian Auto", price: 18.45, change: 4.12 },
      { ticker: "F", companyName: "Ford Motor", price: 12.85, change: 1.95 },
      { ticker: "GM", companyName: "General Motors", price: 38.20, change: 1.67 },
    ],
  },
  5: {
    id: 5,
    headline: "Streaming Wars Intensify as Platforms Battle for Subscriber Growth",
    sentiment: "bearish",
    sourceCount: 7,
    summary: "Competition in the streaming industry has reached a fever pitch as major platforms struggle to maintain subscriber growth. Rising content costs and increased churn rates are putting pressure on profit margins. Some analysts predict further consolidation in the sector.",
    affectedStocks: [
      { ticker: "NFLX", companyName: "Netflix Inc", price: 485.20, change: -2.41 },
      { ticker: "DIS", companyName: "Walt Disney", price: 112.30, change: -0.78 },
      { ticker: "WBD", companyName: "Warner Bros", price: 8.45, change: -1.85 },
      { ticker: "PARA", companyName: "Paramount", price: 11.20, change: -1.42 },
    ],
  },
};

function generateChartData(isPositive: boolean) {
  const points = [];
  let value = 50;
  for (let i = 0; i < 30; i++) {
    value += (Math.random() - (isPositive ? 0.4 : 0.6)) * 4;
    value = Math.max(20, Math.min(80, value));
    points.push(value);
  }
  return points;
}

function MiniStockChart({ isPositive }: { isPositive: boolean }) {
  const data = generateChartData(isPositive);
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

  const news = mockNewsData[newsId] || mockNewsData[1];
  const isBullish = news.sentiment === "bullish";

  const sources = [
    { name: "Bloomberg", color: "bg-blue-600" },
    { name: "Reuters", color: "bg-orange-600" },
    { name: "CNBC", color: "bg-indigo-900" }
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 bg-background z-50">
        <div className="w-9" />
        <h1 className="text-sm font-medium text-muted-foreground">News</h1>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => setLocation("/")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
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
          {news.headline}
        </h2>

        <div className="flex items-center gap-1.5 mb-6">
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
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Summary
          </h3>
          <p className="text-base leading-relaxed text-foreground" data-testid="text-summary">
            {news.summary}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Affected Stocks
          </h3>
          <div className="flex flex-col divide-y divide-border/40">
            {news.affectedStocks.map((stock) => {
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
                  
                  <div className="mx-4">
                    <MiniStockChart isPositive={isUp} />
                  </div>
                  
                  <div className={cn(
                    "px-4 py-2 rounded-md font-bold text-white min-w-[90px] text-center",
                    isUp ? "bg-rh-green" : "bg-rh-red"
                  )} data-testid={`badge-price-${stock.ticker}`}>
                    ${stock.price.toFixed(2)}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
