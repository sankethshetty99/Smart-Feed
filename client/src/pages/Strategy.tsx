import { useState } from "react";
import { Mic } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function StrategyBuilder() {
    const [, navigate] = useLocation();
    const { toast } = useToast();
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const toggleListening = () => {
        setIsListening(!isListening);
        if (!isListening) {
            setTimeout(() => setIsListening(false), 2000);
        }
    };

    const handleSubmit = async () => {
        if (!input.trim()) return;
        setIsProcessing(true);

        try {
            await apiRequest("POST", "/api/strategies", {
                description: input,
                // Optional: we could extract a title from the description using AI later
                title: input.split(" ").slice(0, 4).join(" ") + "..."
            });

            await queryClient.invalidateQueries({ queryKey: ["/api/strategies"] });

            toast({
                title: "Strategy Created",
                description: "We'll notify you when conditions are met.",
            });

            navigate("/strategy");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create strategy. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-full bg-background text-foreground">
            <main className="w-full max-w-3xl mx-auto px-6 py-6 h-full flex flex-col">
                {/* Header */}
                <div className="mb-6 shrink-0">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Strategy builder</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Describe a trading strategy. We'll monitor the market and alert you when conditions are met
                    </p>
                </div>

                {/* Input Area */}
                <div className="flex-1 min-h-0 mb-6">
                    <div className="relative h-full border-2 border-border rounded-xl bg-card overflow-hidden focus-within:border-primary transition-colors flex flex-col">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="E.g., Alert me when Tesla's RSI falls below 30 and the price is above the 200-day moving average..."
                            className="flex-1 w-full text-xl p-4 pb-16 bg-transparent border-none resize-none focus-visible:ring-0 leading-normal"
                        />

                        {/* Mic Icon inside Textarea */}
                        <div className="absolute bottom-4 right-4 z-10">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleListening}
                                className={cn(
                                    "h-10 w-10 rounded-full transition-all duration-200",
                                    isListening
                                        ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Mic className={cn("w-6 h-6", isListening && "animate-pulse")} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 pt-2 pb-2">
                    <Button
                        onClick={handleSubmit}
                        disabled={!input.trim() || isProcessing}
                        className={cn(
                            "w-full h-14 rounded-full text-lg font-bold transition-all duration-200",
                            isProcessing || !input.trim()
                                ? "bg-muted text-muted-foreground"
                                : "bg-rh-green text-white hover:bg-rh-green/90 hover:scale-[1.02] active:scale-[0.98]"
                        )}
                    >
                        {isProcessing ? "Creating Strategy..." : "Create strategy"}
                    </Button>
                </div>
            </main>
        </div>
    );
}
