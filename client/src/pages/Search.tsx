import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <div className="pb-20">
      <main className="w-full max-w-2xl mx-auto pt-8 md:pt-12 px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl tracking-tight font-semibold">Search</h1>
        </div>
        
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <SearchIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2" data-testid="text-search-title">Search for stocks</h2>
          <p className="text-muted-foreground" data-testid="text-search-description">
            Find stocks and ETFs to add to your feed.
          </p>
        </div>
      </main>
    </div>
  );
}
