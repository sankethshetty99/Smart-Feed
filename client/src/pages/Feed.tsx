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
      <main className="max-w-2xl mx-auto pt-10 px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl tracking-tight font-semibold">Smart Feed</h1>
        </div>

        {/* Feed List */}
        <div className="flex flex-col divide-y divide-border/40 border-t border-b border-border/40 mt-4">
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
        
      </main>
      <BottomNav />
    </div>
  );
}
