import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";
import { MockupContainer } from "@/components/MockupContainer";
import Feed from "@/pages/Feed";
import Search from "@/pages/Search";
import Profile from "@/pages/Profile";
import StockDetail from "@/pages/StockDetail";
import NewsDetail from "@/pages/NewsDetail";
import SourcesDetail from "@/pages/SourcesDetail";
import StrategyList from "@/pages/StrategyList";
import StrategyBuilder from "@/pages/Strategy";
import Digest from "@/pages/Digest";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Feed} />
      <Route path="/stocks/:ticker" component={StockDetail} />
      <Route path="/news/:id" component={NewsDetail} />
      <Route path="/news/:id/sources" component={SourcesDetail} />
      <Route path="/search" component={Search} />
      <Route path="/strategy" component={StrategyList} />
      <Route path="/strategy/new" component={StrategyBuilder} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile/digest" component={Digest} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const hideBottomNav = location.startsWith("/stocks/");

  return (
    <div className="h-full bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-16">
        <Router />
      </div>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MockupContainer>
          <AppContent />
        </MockupContainer>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

