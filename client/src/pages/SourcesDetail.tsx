import { useRoute, useLocation } from "wouter";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const newsSources = [
  { name: "Bloomberg", color: "bg-blue-600" },
  { name: "Reuters", color: "bg-orange-600" },
  { name: "CNBC", color: "bg-indigo-900" },
  { name: "WSJ", color: "bg-gray-800" },
  { name: "Financial Times", color: "bg-pink-700" },
  { name: "MarketWatch", color: "bg-green-700" },
  { name: "Yahoo Finance", color: "bg-purple-600" },
  { name: "Barron's", color: "bg-blue-800" },
  { name: "The Motley Fool", color: "bg-indigo-600" },
  { name: "Seeking Alpha", color: "bg-orange-700" },
  { name: "Investor's Business Daily", color: "bg-teal-600" },
  { name: "Forbes", color: "bg-red-700" },
  { name: "Business Insider", color: "bg-blue-500" },
  { name: "The Street", color: "bg-green-600" },
  { name: "Benzinga", color: "bg-yellow-600" },
];

const articleTemplates = [
  "breaks new ground in sector performance",
  "shows surprising quarterly results",
  "announces strategic partnership",
  "faces regulatory scrutiny",
  "expands international operations",
  "reports record-breaking figures",
  "responds to market volatility",
  "unveils new product lineup",
  "navigates supply chain challenges",
  "signals shift in corporate strategy",
  "attracts institutional investor interest",
  "addresses shareholder concerns",
  "posts unexpected revenue growth",
  "adjusts guidance for upcoming quarter",
  "leads industry innovation",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateArticles(newsId: number, count: number) {
  const articles = [];
  const baseTime = Date.now();
  
  for (let i = 0; i < count; i++) {
    const sourceIndex = Math.floor(seededRandom(newsId + i * 7) * newsSources.length);
    const templateIndex = Math.floor(seededRandom(newsId + i * 13) * articleTemplates.length);
    const hoursAgo = Math.floor(seededRandom(newsId + i * 17) * 48);
    
    articles.push({
      id: i + 1,
      source: newsSources[sourceIndex],
      title: `Market update: Industry ${articleTemplates[templateIndex]}`,
      timeAgo: hoursAgo < 1 ? "Just now" : hoursAgo === 1 ? "1 hour ago" : `${hoursAgo} hours ago`,
      timestamp: new Date(baseTime - hoursAgo * 3600000),
    });
  }
  
  return articles.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export default function SourcesDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/news/:id/sources");
  const newsId = parseInt(params?.id || "1", 10);
  
  const minArticles = Math.max(12, 8 + Math.floor(seededRandom(newsId) * 10));
  const articles = generateArticles(newsId, minArticles);

  return (
    <div className="pb-20">
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4">
        <header className="flex items-center justify-start px-4 py-3 sticky top-0 bg-background z-50">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setLocation(`/news/${newsId}`)}
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </header>

        <main className="px-5">
        <h2 className="text-2xl font-bold leading-tight mb-2" data-testid="text-headline">
          Sources
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {articles.length} articles from multiple news outlets
        </p>

        <div className="flex flex-col divide-y divide-border/40">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-start gap-3 py-4 hover:bg-muted/30 -mx-2 px-2 rounded-md transition-colors cursor-pointer"
              data-testid={`article-${article.id}`}
            >
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm flex-shrink-0 mt-0.5",
                  article.source.color
                )}
                title={article.source.name}
              >
                {article.source.name[0]}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {article.source.name}
                </p>
                <p className="font-medium text-foreground leading-snug mb-1">
                  {article.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {article.timeAgo}
                </p>
              </div>
              
              <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>
        </main>
      </div>
    </div>
  );
}
