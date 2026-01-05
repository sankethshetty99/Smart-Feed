import { Settings } from "lucide-react";
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
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>
        
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="-mr-2">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
