import { useFeed } from "@/hooks/use-feed";
import { useUser } from "@/hooks/use-user";
import { FeedCard } from "@/components/FeedCard";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Loader2, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Feed() {
  // Mock logged in user ID = 1
  const USER_ID = 1;
  const { data: user, isLoading: isUserLoading } = useUser(USER_ID);
  const { data: feedItems, isLoading: isFeedLoading, error } = useFeed(USER_ID);

  const isLoading = isUserLoading || isFeedLoading;

  // Portfolio summary mock
  const portfolioValue = 24562.34;
  const dayChange = 342.12;
  const dayChangePercent = 1.41;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-4 text-center">
        <p className="text-destructive font-semibold mb-2">Unable to load feed</p>
        <p className="text-muted-foreground text-sm">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Smart Feed" subtitle={`Welcome, ${user.username}`} />

      <main className="max-w-md mx-auto">
        {/* Portfolio Summary Card */}
        <div className="px-4 py-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm shadow-black/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet className="w-24 h-24" />
            </div>
            
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
              Investing
            </p>
            <h2 className="text-3xl font-display font-bold tracking-tight mb-2">
              ${portfolioValue.toLocaleString()}
            </h2>
            <div className="flex items-center text-sm font-semibold text-rh-green">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+${dayChange} ({dayChangePercent}%)</span>
              <span className="text-muted-foreground ml-2 font-normal">Today</span>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="px-5 mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight">Today's Digest</h3>
          <button className="text-xs font-semibold text-primary flex items-center hover:opacity-80 transition-opacity">
            Customize <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>

        {/* Feed List */}
        <div className="flex flex-col divide-y divide-border/40 border-t border-b border-border/40">
          {feedItems && feedItems.length > 0 ? (
            feedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <FeedCard item={item} />
              </motion.div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>No updates for your watchlist right now.</p>
            </div>
          )}
        </div>
        
        <div className="p-6 text-center">
          <p className="text-xs text-muted-foreground">
            That's all for now! Check back later for more updates on your portfolio.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
