import { Link } from "wouter";
import { Plus, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Strategy } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function StrategyList() {
    const { data: strategies, isLoading } = useQuery<Strategy[]>({
        queryKey: ["/api/strategies"],
    });

    return (
        <div className="min-h-screen bg-background text-foreground pb-24">
            <main className="w-full max-w-2xl mx-auto px-6 py-6 pt-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Strategy</h1>
                    <Link href="/strategy/new">
                        <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium px-4">
                            <Plus className="w-4 h-4 mr-1" />
                            New
                        </Button>
                    </Link>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {isLoading ? (
                        // Loading Skeletons
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 py-4 border-b border-border/50">
                                <Skeleton className="h-4 w-3/4 bg-muted" />
                                <Skeleton className="h-4 w-4 rounded-full ml-auto bg-muted" />
                            </div>
                        ))
                    ) : strategies && strategies.length > 0 ? (
                        <div className="divide-y divide-border/50">
                            {strategies.map((strategy) => (
                                <div
                                    key={strategy.id}
                                    className="group flex items-center justify-between py-5 cursor-pointer hover:bg-muted/30 -mx-4 px-4 rounded-lg transition-colors"
                                >
                                    <div className="flex-1 pr-4">
                                        <h3 className="text-lg font-medium leading-none mb-2">
                                            {/* Use the description as title for now since title is optional/missing in basic input */}
                                            {strategy.title || (strategy.description.length > 30 ? strategy.description.slice(0, 30) + "..." : strategy.description)}
                                        </h3>
                                        {strategy.title && (
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {strategy.description}
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No active strategies.</p>
                            <p className="text-sm mt-1">Tap "+ New" to create one.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
