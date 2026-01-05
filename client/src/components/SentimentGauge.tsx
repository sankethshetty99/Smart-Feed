import { cn } from "@/lib/utils";

interface SentimentGaugeProps {
  score: number; // -1.0 to 1.0
  className?: string;
}

export function SentimentGauge({ score, className }: SentimentGaugeProps) {
  // Normalize -1 to 1 range to 0 to 100 percentage
  const percentage = ((score + 1) / 2) * 100;
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500",
            score > 0 ? "bg-rh-green" : "bg-rh-red"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
