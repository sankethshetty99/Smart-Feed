import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Investing" />
      <main className="max-w-md mx-auto px-4 pt-6">
        <div className="mb-8">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
            Investing
          </p>
          <h2 className="text-4xl font-bold tracking-tight mb-2">$24,562.34</h2>
          <div className="flex items-center text-sm font-semibold text-rh-green">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+$342.12 (1.41%)</span>
            <span className="text-muted-foreground ml-2 font-normal">Today</span>
          </div>
        </div>

        <section className="mt-8">
          <h3 className="text-lg font-bold mb-4">Lists</h3>
          <div className="space-y-4">
            {[
              { ticker: "TSLA", price: 248.50, change: 3.2 },
              { ticker: "NVDA", price: 875.20, change: -1.5 },
              { ticker: "AAPL", price: 178.35, change: 0.8 },
            ].map((stock) => (
              <div key={stock.ticker} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-bold">{stock.ticker}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold">${stock.price.toFixed(2)}</p>
                  <p className={`text-xs font-bold ${stock.change >= 0 ? 'text-rh-green' : 'text-rh-red'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}