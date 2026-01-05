import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useUser } from "@/hooks/use-user";
import { User as UserIcon, Settings, Shield, HelpCircle, LogOut } from "lucide-react";

export default function Profile() {
  const USER_ID = 1;
  const { data: user } = useUser(USER_ID);

  const menuItems = [
    { label: "Settings", icon: Settings },
    { label: "Security & Privacy", icon: Shield },
    { label: "Help & Support", icon: HelpCircle },
    { label: "Log Out", icon: LogOut, className: "text-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Profile" />
      
      <main className="max-w-md mx-auto pt-6">
        <div className="px-6 mb-8 text-center">
          <div className="w-24 h-24 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-muted-foreground">
            {user?.username?.[0]?.toUpperCase() || <UserIcon className="w-10 h-10" />}
          </div>
          <h2 className="text-2xl font-bold">{user?.username || "Loading..."}</h2>
          <p className="text-muted-foreground text-sm mt-1 capitalize">
            {user?.riskTolerance || "Investor"} • Member since 2024
          </p>
        </div>

        <div className="px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center p-4 bg-card rounded-xl border border-border hover:bg-muted/50 transition-colors ${item.className || ""}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
