import { useRoute, useLocation } from "wouter";
import { ChevronLeft, ArrowUpRight, ArrowDownRight, TrendingUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mockStockData: Record<string, {
  ticker: string;
  companyName: string;
  price: number;
  dayChange: number;
  dayChangePercent: number;
  afterHoursChange: number;
  afterHoursPercent: number;
}> = {
  TSLA: { ticker: "TSLA", companyName: "Tesla, Inc.", price: 248.50, dayChange: 7.72, dayChangePercent: 3.20, afterHoursChange: 0.85, afterHoursPercent: 0.34 },
  NVDA: { ticker: "NVDA", companyName: "NVIDIA Corporation", price: 875.20, dayChange: -13.31, dayChangePercent: -1.50, afterHoursChange: -2.10, afterHoursPercent: -0.24 },
  AAPL: { ticker: "AAPL", companyName: "Apple Inc.", price: 178.35, dayChange: 1.42, dayChangePercent: 0.80, afterHoursChange: 0.27, afterHoursPercent: 0.15 },
  GOOGL: { ticker: "GOOGL", companyName: "Alphabet Inc.", price: 142.85, dayChange: 2.04, dayChangePercent: 1.45, afterHoursChange: 0.38, afterHoursPercent: 0.27 },
  MSFT: { ticker: "MSFT", companyName: "Microsoft Corporation", price: 378.92, dayChange: 8.08, dayChangePercent: 2.18, afterHoursChange: 1.12, afterHoursPercent: 0.30 },
  AMZN: { ticker: "AMZN", companyName: "Amazon.com, Inc.", price: 178.25, dayChange: -2.38, dayChangePercent: -1.32, afterHoursChange: -0.45, afterHoursPercent: -0.25 },
  META: { ticker: "META", companyName: "Meta Platforms, Inc.", price: 485.60, dayChange: 8.92, dayChangePercent: 1.87, afterHoursChange: 1.25, afterHoursPercent: 0.26 },
  NFLX: { ticker: "NFLX", companyName: "Netflix, Inc.", price: 485.20, dayChange: 15.28, dayChangePercent: 3.25, afterHoursChange: 2.10, afterHoursPercent: 0.43 },
  AMD: { ticker: "AMD", companyName: "Advanced Micro Devices", price: 145.80, dayChange: 3.48, dayChangePercent: 2.45, afterHoursChange: 0.58, afterHoursPercent: 0.40 },
  INTC: { ticker: "INTC", companyName: "Intel Corporation", price: 42.50, dayChange: -0.25, dayChangePercent: -0.58, afterHoursChange: -0.12, afterHoursPercent: -0.28 },
  JPM: { ticker: "JPM", companyName: "JPMorgan Chase & Co.", price: 195.40, dayChange: 1.78, dayChangePercent: 0.92, afterHoursChange: 0.35, afterHoursPercent: 0.18 },
  XOM: { ticker: "XOM", companyName: "Exxon Mobil Corporation", price: 108.75, dayChange: 0.70, dayChangePercent: 0.65, afterHoursChange: 0.15, afterHoursPercent: 0.14 },
  DIS: { ticker: "DIS", companyName: "The Walt Disney Company", price: 112.30, dayChange: -0.88, dayChangePercent: -0.78, afterHoursChange: -0.22, afterHoursPercent: -0.20 },
  BA: { ticker: "BA", companyName: "The Boeing Company", price: 198.50, dayChange: -4.37, dayChangePercent: -2.15, afterHoursChange: -1.10, afterHoursPercent: -0.55 },
};

function generateChartData(isPositive: boolean) {
  const points = [];
  let value = 50;
  for (let i = 0; i < 50; i++) {
    value += (Math.random() - (isPositive ? 0.4 : 0.6)) * 5;
    value = Math.max(10, Math.min(90, value));
    points.push(value);
  }
  return points;
}

function MiniChart({ isPositive }: { isPositive: boolean }) {
  const data = generateChartData(isPositive);
  const color = isPositive ? "#00C805" : "#FF5000";
  
  const pathD = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - val;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="w-full h-48 my-6">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="100"
          cy={100 - data[data.length - 1]}
          r="2"
          fill={color}
          className="animate-pulse"
        />
      </svg>
    </div>
  );
}

const timeframes = ["1D", "1W", "1M", "3M", "YTD", "1Y", "5Y"];

export default function StockDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/stocks/:ticker");
  const ticker = params?.ticker?.toUpperCase() || "";
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");

  const stock = mockStockData[ticker] || {
    ticker,
    companyName: `${ticker} Company`,
    price: 100.00,
    dayChange: 1.50,
    dayChangePercent: 1.52,
    afterHoursChange: 0.25,
    afterHoursPercent: 0.25,
  };

  const isPositive = stock.dayChangePercent >= 0;
  const isAfterHoursPositive = stock.afterHoursPercent >= 0;

  return (
    <div className="pb-32">
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4">
        <header className="flex items-center justify-start px-4 py-3">
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
        <p className="text-sm text-muted-foreground font-medium mb-1" data-testid="text-ticker">
          {stock.ticker}
        </p>
        <h1 className="text-2xl font-bold mb-1" data-testid="text-company-name">
          {stock.companyName}
        </h1>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-bold" data-testid="text-price">
            ${stock.price.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 mt-2">
          <div className={cn(
            "flex items-center text-sm font-medium",
            isPositive ? "text-rh-green" : "text-rh-red"
          )} data-testid="text-day-change">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            ${Math.abs(stock.dayChange).toFixed(2)} ({Math.abs(stock.dayChangePercent).toFixed(2)}%)
            <span className="text-muted-foreground ml-2">Today</span>
          </div>
          <div className={cn(
            "flex items-center text-sm font-medium",
            isAfterHoursPositive ? "text-rh-green" : "text-rh-red"
          )} data-testid="text-after-hours">
            {isAfterHoursPositive ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            ${Math.abs(stock.afterHoursChange).toFixed(2)} ({Math.abs(stock.afterHoursPercent).toFixed(2)}%)
            <span className="text-muted-foreground ml-2">After-hours</span>
          </div>
        </div>

        <MiniChart isPositive={isPositive} />

        <div className="overflow-x-auto -mx-5 px-5 border-t border-border/40 pt-4">
          <div className="flex items-center gap-2 min-w-max">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap",
                  selectedTimeframe === tf
                    ? "bg-rh-green/10 text-rh-green border border-rh-green"
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-testid={`button-timeframe-${tf}`}
              >
                {tf}
              </button>
            ))}
            <button
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-border text-foreground whitespace-nowrap"
              data-testid="button-advanced"
            >
              Advanced
            </button>
          </div>
        </div>

        <div className="mt-8">
          <button className="flex items-center text-rh-green font-semibold text-lg" data-testid="button-digests">
            Digests
            <ArrowUpRight className="w-5 h-5 ml-1" />
          </button>
        </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/40 px-5 py-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto px-3 sm:px-4">
          <button className="flex items-center gap-2 text-foreground font-medium" data-testid="button-individual">
            <TrendingUp className="w-5 h-5" />
            Individual
            <ChevronDown className="w-4 h-4" />
          </button>
          <Button 
            className="bg-rh-green hover:bg-rh-green/90 text-white px-12 rounded-full"
            data-testid="button-trade"
          >
            Trade
          </Button>
        </div>
      </div>
    </div>
  );
}
