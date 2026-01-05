import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Search" />
      
      <main className="flex flex-col items-center justify-center h-[70vh] px-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <SearchIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2" data-testid="text-search-title">Search for stocks</h2>
        <p className="text-muted-foreground" data-testid="text-search-description">
          Find stocks and ETFs to add to your feed.
        </p>
      </main>
      
      <BottomNav />
    </div>
  );
}
