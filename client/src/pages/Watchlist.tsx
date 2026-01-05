import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { EyeOff } from "lucide-react";

export default function Watchlist() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Watchlist" />
      
      <main className="flex flex-col items-center justify-center h-[70vh] px-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <EyeOff className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">Your watchlist is empty</h2>
        <p className="text-muted-foreground">
          Search for stocks and ETFs to track their performance here.
        </p>
      </main>
      
      <BottomNav />
    </div>
  );
}
