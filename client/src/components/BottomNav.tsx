import { Link, useLocation } from "wouter";
import { Compass, Eye, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Feed", icon: Compass },
    { href: "/watchlist", label: "Watchlist", icon: Eye },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-md pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div 
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 cursor-pointer transition-colors duration-200",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon 
                  className={cn(
                    "w-6 h-6 mb-1 transition-transform duration-200",
                    isActive && "scale-110"
                  )} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium tracking-wide">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
