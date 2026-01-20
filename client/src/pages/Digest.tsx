import { motion } from "framer-motion";
import { ChevronLeft, TrendingDown, Building2, Rocket } from "lucide-react";
import { useLocation } from "wouter";

export default function Digest() {
    const [, setLocation] = useLocation();

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 px-4 h-14 flex items-center gap-4">
                <button
                    onClick={() => setLocation("/profile")}
                    className="p-1 -ml-1 hover:bg-muted rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold font-display">Daily Recap</h1>
            </header>

            <main className="max-w-3xl mx-auto p-4 md:p-6">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold font-display tracking-tight">Today's Digest</h2>
                    <p className="text-muted-foreground">The 3 key events that moved the markets and your portfolio today</p>
                </div>

                <div className="space-y-6">
                    {/* Item 1: High Priority - Red Accent */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 items-start p-4 bg-card border border-border/50 rounded-2xl shadow-sm"
                    >
                        <div className="mt-1 bg-rh-red-subtle p-2 rounded-full shrink-0">
                            <TrendingDown className="w-5 h-5 text-rh-red" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground text-lg">
                                EV sector slid on new tax regulation news
                            </h3>
                            <p className="text-muted-foreground mt-1 leading-relaxed">
                                <span className="font-medium text-foreground/80">Context:</span> Markets reacted to new EV tax regulations announced this morning. Your Tesla position fell 5% as a result.
                            </p>
                        </div>
                    </motion.div>

                    {/* Item 2: Market Context - Neutral/Grey */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex gap-4 items-start p-4 bg-card border border-border/50 rounded-2xl shadow-sm"
                    >
                        <div className="mt-1 bg-secondary p-2 rounded-full shrink-0">
                            <Building2 className="w-5 h-5 text-foreground/70" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground text-lg">
                                Fed Meeting triggered macro-wide volatility
                            </h3>
                            <p className="text-muted-foreground mt-1 leading-relaxed">
                                <span className="font-medium text-foreground/80">Context:</span> The 2:00 PM ET meeting sparked swings across all major indices, significantly impacting Tech and Crypto sectors in your watchlist.
                            </p>
                        </div>
                    </motion.div>

                    {/* Item 3: Opportunity - Green Accent */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex gap-4 items-start p-4 bg-card border border-border/50 rounded-2xl shadow-sm"
                    >
                        <div className="mt-1 bg-rh-green-subtle p-2 rounded-full shrink-0">
                            <Rocket className="w-5 h-5 text-rh-green" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground text-lg">
                                Bitcoin reached a historic $100k milestone
                            </h3>
                            <p className="text-muted-foreground mt-1 leading-relaxed">
                                <span className="font-medium text-foreground/80">Context:</span> Digital assets hit a new all-time high today, a major class-wide event that pushed your crypto holdings to new gains.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Button */}
                <div className="mt-12 mb-8">
                    <button
                        onClick={() => setLocation("/profile")}
                        className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium h-12 rounded-xl text-base transition-colors shadow-sm"
                    >
                        Got it, thanks
                    </button>
                </div>
            </main>
        </div>
    );
}
