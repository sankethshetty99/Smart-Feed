import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = "Investing", subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="-mr-2">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
