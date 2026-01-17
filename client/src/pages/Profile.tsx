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
    <div className="pb-20">
      <main className="w-full max-w-3xl mx-auto pt-6 md:pt-10 px-3 sm:px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl tracking-tight font-semibold">Profile</h1>
        </div>
        
        <div className="mb-8 text-center">
          <div className="w-24 h-24 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-muted-foreground">
            {user?.username?.[0]?.toUpperCase() || <UserIcon className="w-10 h-10" />}
          </div>
          <h2 className="text-2xl font-bold">{user?.username || "Loading..."}</h2>
          <p className="text-muted-foreground text-sm mt-1 capitalize">
            {user?.riskTolerance || "Investor"} Risk Tolerance
          </p>
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center p-4 bg-card rounded-md border border-border hover:bg-muted/50 transition-colors ${item.className || ""}`}
              data-testid={`button-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
