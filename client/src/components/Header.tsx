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
        <div className="flex-1">
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="flex-2 text-center">
          <h1 className="text-base font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex-1 flex justify-end space-x-1">
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
