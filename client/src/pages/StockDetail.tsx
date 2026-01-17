import { useRoute, useLocation } from "wouter";
import { ChevronLeft, TrendingUp, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mockStockData: Record<string, {
  ticker: string;
  companyName: string;
  shortName: string;
  price: number;
  dayChange: number;
  dayChangePercent: number;
  afterHoursChange: number;
  afterHoursPercent: number;
  description: string;
  ceo: string;
  founded: string;
  employees: string;
  headquarters: string;
  bid: number;
  bidSize: number;
  ask: number;
  askSize: number;
  volume: string;
  overnightVol: string;
  avgVol: string;
  open: number;
  high: number;
  low: number;
}> = {
  TSLA: { ticker: "TSLA", companyName: "Tesla, Inc.", shortName: "Tesla", price: 248.50, dayChange: 7.72, dayChangePercent: 3.20, afterHoursChange: 0.85, afterHoursPercent: 0.34, description: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems...", ceo: "Elon Musk", founded: "2003", employees: "127,855", headquarters: "Austin, Texas", bid: 248.45, bidSize: 3, ask: 248.55, askSize: 2, volume: "98.23M", overnightVol: "52.10K", avgVol: "85.42M", open: 245.20, high: 250.10, low: 244.80 },
  NVDA: { ticker: "NVDA", companyName: "NVIDIA Corporation", shortName: "NVIDIA", price: 875.20, dayChange: -13.31, dayChangePercent: -1.50, afterHoursChange: -2.10, afterHoursPercent: -0.24, description: "NVIDIA Corporation provides graphics, and compute and networking solutions...", ceo: "Jensen Huang", founded: "1993", employees: "29,600", headquarters: "Santa Clara, California", bid: 875.10, bidSize: 2, ask: 875.30, askSize: 2, volume: "45.67M", overnightVol: "28.30K", avgVol: "42.10M", open: 880.50, high: 882.20, low: 872.10 },
  AAPL: { ticker: "AAPL", companyName: "Apple Inc.", shortName: "Apple", price: 255.22, dayChange: -2.73, dayChangePercent: -1.06, afterHoursChange: -0.26, afterHoursPercent: -0.10, description: "Apple, Inc. engages in the design, manufacture, and sale of smartphones, personal computers, tablets, wearables and accessories, and other varieties of...", ceo: "Timothy Donald Cook", founded: "1976", employees: "166,000", headquarters: "Cupertino, California", bid: 255.14, bidSize: 2, ask: 255.25, askSize: 2, volume: "72.14M", overnightVol: "47.01K", avgVol: "42.83M", open: 258.05, high: 258.90, low: 255.06 },
  GOOGL: { ticker: "GOOGL", companyName: "Alphabet Inc.", shortName: "Alphabet", price: 142.85, dayChange: 2.04, dayChangePercent: 1.45, afterHoursChange: 0.38, afterHoursPercent: 0.27, description: "Alphabet Inc. offers various products and platforms...", ceo: "Sundar Pichai", founded: "2015", employees: "182,502", headquarters: "Mountain View, California", bid: 142.80, bidSize: 3, ask: 142.90, askSize: 2, volume: "28.45M", overnightVol: "15.20K", avgVol: "25.80M", open: 141.20, high: 143.50, low: 140.80 },
  MSFT: { ticker: "MSFT", companyName: "Microsoft Corporation", shortName: "Microsoft", price: 378.92, dayChange: 8.08, dayChangePercent: 2.18, afterHoursChange: 1.12, afterHoursPercent: 0.30, description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide...", ceo: "Satya Nadella", founded: "1975", employees: "221,000", headquarters: "Redmond, Washington", bid: 378.85, bidSize: 2, ask: 378.98, askSize: 2, volume: "22.30M", overnightVol: "12.50K", avgVol: "20.10M", open: 372.50, high: 380.20, low: 371.80 },
  AMZN: { ticker: "AMZN", companyName: "Amazon.com, Inc.", shortName: "Amazon", price: 178.25, dayChange: -2.38, dayChangePercent: -1.32, afterHoursChange: -0.45, afterHoursPercent: -0.25, description: "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores...", ceo: "Andy Jassy", founded: "1994", employees: "1,541,000", headquarters: "Seattle, Washington", bid: 178.20, bidSize: 3, ask: 178.30, askSize: 2, volume: "55.80M", overnightVol: "32.10K", avgVol: "48.50M", open: 180.20, high: 181.10, low: 177.80 },
  META: { ticker: "META", companyName: "Meta Platforms, Inc.", shortName: "Meta", price: 485.60, dayChange: 8.92, dayChangePercent: 1.87, afterHoursChange: 1.25, afterHoursPercent: 0.26, description: "Meta Platforms, Inc. develops products that enable people to connect and share with friends and family...", ceo: "Mark Zuckerberg", founded: "2004", employees: "86,482", headquarters: "Menlo Park, California", bid: 485.50, bidSize: 2, ask: 485.70, askSize: 2, volume: "18.90M", overnightVol: "9.80K", avgVol: "16.50M", open: 478.20, high: 487.50, low: 477.10 },
  NFLX: { ticker: "NFLX", companyName: "Netflix, Inc.", shortName: "Netflix", price: 485.20, dayChange: 15.28, dayChangePercent: 3.25, afterHoursChange: 2.10, afterHoursPercent: 0.43, description: "Netflix, Inc. provides entertainment services...", ceo: "Ted Sarandos", founded: "1997", employees: "13,000", headquarters: "Los Gatos, California", bid: 485.10, bidSize: 2, ask: 485.30, askSize: 2, volume: "8.45M", overnightVol: "4.20K", avgVol: "7.80M", open: 472.50, high: 488.20, low: 471.80 },
  AMD: { ticker: "AMD", companyName: "Advanced Micro Devices", shortName: "AMD", price: 145.80, dayChange: 3.48, dayChangePercent: 2.45, afterHoursChange: 0.58, afterHoursPercent: 0.40, description: "Advanced Micro Devices, Inc. operates as a semiconductor company worldwide...", ceo: "Lisa Su", founded: "1969", employees: "26,000", headquarters: "Santa Clara, California", bid: 145.75, bidSize: 3, ask: 145.85, askSize: 2, volume: "62.30M", overnightVol: "35.10K", avgVol: "58.20M", open: 143.20, high: 146.50, low: 142.80 },
  INTC: { ticker: "INTC", companyName: "Intel Corporation", shortName: "Intel", price: 42.50, dayChange: -0.25, dayChangePercent: -0.58, afterHoursChange: -0.12, afterHoursPercent: -0.28, description: "Intel Corporation designs, develops, manufactures, markets, and sells computing and related products and services worldwide...", ceo: "Pat Gelsinger", founded: "1968", employees: "124,800", headquarters: "Santa Clara, California", bid: 42.45, bidSize: 4, ask: 42.55, askSize: 3, volume: "38.50M", overnightVol: "18.20K", avgVol: "35.80M", open: 42.80, high: 43.10, low: 42.30 },
  JPM: { ticker: "JPM", companyName: "JPMorgan Chase & Co.", shortName: "JPMorgan", price: 195.40, dayChange: 1.78, dayChangePercent: 0.92, afterHoursChange: 0.35, afterHoursPercent: 0.18, description: "JPMorgan Chase & Co. operates as a financial services company worldwide...", ceo: "Jamie Dimon", founded: "2000", employees: "309,926", headquarters: "New York, New York", bid: 195.35, bidSize: 2, ask: 195.45, askSize: 2, volume: "12.80M", overnightVol: "6.50K", avgVol: "11.20M", open: 194.20, high: 196.10, low: 193.80 },
  XOM: { ticker: "XOM", companyName: "Exxon Mobil Corporation", shortName: "Exxon", price: 108.75, dayChange: 0.70, dayChangePercent: 0.65, afterHoursChange: 0.15, afterHoursPercent: 0.14, description: "Exxon Mobil Corporation explores for and produces crude oil and natural gas...", ceo: "Darren Woods", founded: "1999", employees: "62,000", headquarters: "Spring, Texas", bid: 108.70, bidSize: 3, ask: 108.80, askSize: 2, volume: "15.40M", overnightVol: "7.80K", avgVol: "14.20M", open: 108.20, high: 109.30, low: 107.80 },
  DIS: { ticker: "DIS", companyName: "The Walt Disney Company", shortName: "Disney", price: 112.30, dayChange: -0.88, dayChangePercent: -0.78, afterHoursChange: -0.22, afterHoursPercent: -0.20, description: "The Walt Disney Company operates as an entertainment company worldwide...", ceo: "Bob Iger", founded: "1923", employees: "225,000", headquarters: "Burbank, California", bid: 112.25, bidSize: 2, ask: 112.35, askSize: 2, volume: "9.80M", overnightVol: "4.50K", avgVol: "8.90M", open: 113.20, high: 113.80, low: 111.90 },
  BA: { ticker: "BA", companyName: "The Boeing Company", shortName: "Boeing", price: 198.50, dayChange: -4.37, dayChangePercent: -2.15, afterHoursChange: -1.10, afterHoursPercent: -0.55, description: "The Boeing Company designs, develops, manufactures, sells, services, and supports commercial jetliners, military aircraft...", ceo: "David Calhoun", founded: "1916", employees: "156,000", headquarters: "Arlington, Virginia", bid: 198.40, bidSize: 2, ask: 198.60, askSize: 2, volume: "7.20M", overnightVol: "3.80K", avgVol: "6.50M", open: 202.50, high: 203.20, low: 197.80 },
};

function generateChartData(isPositive: boolean) {
  const points = [];
  let value = 50;
  for (let i = 0; i < 100; i++) {
    value += (Math.random() - (isPositive ? 0.45 : 0.55)) * 4;
    value = Math.max(10, Math.min(90, value));
    points.push(value);
  }
  return points;
}

function StockChart({ isPositive }: { isPositive: boolean }) {
  const data = generateChartData(isPositive);
  const color = isPositive ? "#00C805" : "#FF6B8A";
  const maxVal = Math.max(...data);

  const pathD = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - val;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Create dotted line at the peak
  const peakY = 100 - maxVal;

  return (
    <div className="w-full h-64 my-4 relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {/* Dotted horizontal line at peak */}
        <line
          x1="0"
          y1={peakY}
          x2="100"
          y2={peakY}
          stroke={isPositive ? "rgba(0, 200, 5, 0.3)" : "rgba(255, 107, 138, 0.3)"}
          strokeWidth="0.3"
          strokeDasharray="1,1"
          vectorEffect="non-scaling-stroke"
        />
        {/* Main chart line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

// Triangle indicators for price changes
function TriangleUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 10 10" fill="currentColor">
      <polygon points="5,0 10,10 0,10" />
    </svg>
  );
}

function TriangleDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 10 10" fill="currentColor">
      <polygon points="0,0 10,0 5,10" />
    </svg>
  );
}

const timeframes = ["1D", "1W", "1M", "3M", "YTD", "1Y"];

export default function StockDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/stocks/:ticker");
  const ticker = params?.ticker?.toUpperCase() || "";
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const stock = mockStockData[ticker] || {
    ticker,
    companyName: `${ticker} Company`,
    shortName: ticker,
    price: 100.00,
    dayChange: 1.50,
    dayChangePercent: 1.52,
    afterHoursChange: 0.25,
    afterHoursPercent: 0.25,
    description: "Company description not available.",
    ceo: "N/A",
    founded: "N/A",
    employees: "N/A",
    headquarters: "N/A",
    bid: 99.95,
    bidSize: 2,
    ask: 100.05,
    askSize: 2,
    volume: "N/A",
    overnightVol: "N/A",
    avgVol: "N/A",
    open: 99.50,
    high: 101.00,
    low: 99.00,
  };

  const isPositive = stock.dayChangePercent >= 0;
  const isAfterHoursPositive = stock.afterHoursPercent >= 0;

  return (
    <div className="pb-32 bg-black text-white min-h-screen">
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4">
        <header className="flex items-center justify-start px-4 py-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-rh-pink hover:text-rh-pink/80 hover:bg-transparent"
            data-testid="button-back"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </header>

        <main className="px-5">
          {/* Stock Header */}
          <p className="text-sm text-gray-500 font-medium mb-1" data-testid="text-ticker">
            {stock.ticker}
          </p>
          <h1 className="text-3xl font-bold mb-1 text-white" data-testid="text-company-name">
            {stock.shortName}
          </h1>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-bold text-white" data-testid="text-price">
              ${stock.price.toFixed(2)}
            </span>
            <span className="w-6 h-6 rounded-full border border-yellow-500 flex items-center justify-center">
              <ArrowRight className="w-3 h-3 text-yellow-500" />
            </span>
          </div>

          {/* Price Changes */}
          <div className="flex flex-col gap-1 mt-3">
            <div className={cn(
              "flex items-center text-sm font-medium",
              isPositive ? "text-rh-green" : "text-yellow-500"
            )} data-testid="text-day-change">
              {isPositive ? (
                <TriangleUp className="w-3 h-3 mr-1" />
              ) : (
                <TriangleDown className="w-3 h-3 mr-1" />
              )}
              <span>${Math.abs(stock.dayChange).toFixed(2)} ({Math.abs(stock.dayChangePercent).toFixed(2)}%)</span>
              <span className="text-gray-500 ml-2">Today</span>
            </div>
            <div className={cn(
              "flex items-center text-sm font-medium",
              isAfterHoursPositive ? "text-rh-green" : "text-yellow-500"
            )} data-testid="text-after-hours">
              {isAfterHoursPositive ? (
                <TriangleUp className="w-3 h-3 mr-1" />
              ) : (
                <TriangleDown className="w-3 h-3 mr-1" />
              )}
              <span>${Math.abs(stock.afterHoursChange).toFixed(2)} ({Math.abs(stock.afterHoursPercent).toFixed(2)}%)</span>
              <span className="text-gray-500 ml-2">After-hours</span>
            </div>
          </div>

          {/* Stock Chart */}
          <StockChart isPositive={isPositive} />

          {/* Timeframe Buttons */}
          <div className="overflow-x-auto -mx-5 px-5">
            <div className="flex items-center gap-3 min-w-max">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap",
                    selectedTimeframe === tf
                      ? "bg-rh-green/15 text-rh-green border border-rh-green"
                      : "text-gray-500 hover:text-white"
                  )}
                  data-testid={`button-timeframe-${tf}`}
                >
                  {tf}
                </button>
              ))}
              <button
                className="px-4 py-1.5 text-sm font-medium rounded-full border border-gray-700 text-white whitespace-nowrap ml-auto"
                data-testid="button-advanced"
              >
                Advanced
              </button>
            </div>
          </div>

          {/* Digests Link */}
          <div className="mt-8 mb-8">
            <button className="flex items-center text-rh-pink font-semibold text-xl" data-testid="button-digests">
              Digests
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* About Section */}
          <div className="border-t border-gray-800 pt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">About {stock.shortName}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {showFullDescription ? stock.description : stock.description.slice(0, 150) + "..."}
            </p>
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-rh-pink text-sm font-medium mt-2"
            >
              {showFullDescription ? "Show less" : "Show more"}
            </button>

            {/* Company Details Grid */}
            <div className="grid grid-cols-2 gap-y-4 mt-6">
              <div>
                <p className="text-gray-500 text-xs mb-1">CEO</p>
                <p className="text-white text-sm font-medium">{stock.ceo}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Founded</p>
                <p className="text-white text-sm font-medium">{stock.founded}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Employees</p>
                <p className="text-white text-sm font-medium">{stock.employees}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Headquarters</p>
                <p className="text-white text-sm font-medium">{stock.headquarters}</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-t border-gray-800 pt-6 mt-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Stats</h2>

            {/* Bid/Ask Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-left">
                <p className="text-gray-500 text-xs mb-1">Bid</p>
                <p className="text-white text-lg font-bold">${stock.bid.toFixed(2)}</p>
                <p className="text-gray-500 text-xs">x {stock.bidSize}</p>
              </div>

              {/* Bid/Ask Visual Bars */}
              <div className="flex gap-2">
                <div className="w-10 h-8 bg-green-900 rounded"></div>
                <div className="w-10 h-8 bg-red-900 rounded border border-red-700"></div>
              </div>

              <div className="text-right">
                <p className="text-gray-500 text-xs mb-1">Ask</p>
                <p className="text-white text-lg font-bold">${stock.ask.toFixed(2)}</p>
                <p className="text-gray-500 text-xs">x {stock.askSize}</p>
              </div>
            </div>

            {/* Volume Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-gray-500 text-xs mb-1">Volume</p>
                <p className="text-white text-sm font-medium">{stock.volume}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Overnight vol</p>
                <p className="text-white text-sm font-medium">{stock.overnightVol}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Average vol</p>
                <p className="text-white text-sm font-medium">{stock.avgVol}</p>
              </div>
            </div>

            {/* Price Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500 text-xs mb-1">Open</p>
                <p className="text-white text-sm font-medium">${stock.open.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Today's high</p>
                <p className="text-white text-sm font-medium">${stock.high.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Today's low</p>
                <p className="text-white text-sm font-medium">${stock.low.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Trade Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-5 py-4 z-50">
        <div className="flex items-center justify-between max-w-3xl mx-auto px-3 sm:px-4">
          <button className="flex items-center gap-2 text-white font-medium" data-testid="button-individual">
            <TrendingUp className="w-5 h-5" />
            Individual
            <ChevronDown className="w-4 h-4" />
          </button>
          <Button
            className="bg-rh-pink hover:bg-rh-pink/90 text-white px-8 py-3 rounded-full text-base font-semibold"
            data-testid="button-trade"
          >
            Trade
          </Button>
        </div>
      </div>
    </div>
  );
}
