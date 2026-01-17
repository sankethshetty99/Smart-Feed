import { useUser } from "@/hooks/use-user";
import { User as UserIcon, Settings, Shield, HelpCircle, LogOut, ChevronRight, Briefcase, Wallet, Building2, TrendingUp, Pencil } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const USER_ID = 1; // Assuming user ID 1 for now
  const { data: user } = useUser(USER_ID);

  const accounts = [
    { type: "Individual", balance: "$121.88", count: "1 account", icon: UserIcon },
    { type: "Joint", balance: "$1.00", count: "1 account", icon: Wallet },
    { type: "Retirement", balance: "$0.00", count: "1 account", icon: Building2 },
  ];

  return (
    <div className="min-h-screen pb-24 bg-background text-foreground animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-start pt-6 px-6">
        <Button variant="ghost" size="icon" className="text-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </Button>
        <div className="absolute top-6 right-6">
          <ModeToggle />
        </div>
      </div>

      <main className="px-6 mt-4">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-4 border-background">
              {user?.username?.[0] ? (
                <span className="text-4xl font-bold">{user.username[0].toUpperCase()}</span>
              ) : (
                <UserIcon className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full border-4 border-background text-primary-foreground hover:bg-primary/90 transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <h2 className="mt-3 text-lg font-medium text-foreground">@{user?.username || "sankethshetty"}</h2>
        </div>

        {/* Balance Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tight mb-2">$4,117.92</h1>
          <p className="text-muted-foreground text-sm font-medium">Total in SmartFeed</p>
          <button className="mt-2 text-primary font-bold text-sm hover:underline">
            Add account
          </button>
        </div>

        {/* Banner */}
        <div className="mb-10 bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors group">
          <div className="flex-1 pr-4">
            <p className="text-sm font-medium leading-relaxed">
              <span className="text-3xl font-bold text-[#b4f536] italic mr-2 align-middle">2%</span>
              <span className="align-middle">Get 2% bonus on taxable account transfers. Ends 2/13. Terms apply.</span>
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>

        {/* Accounts List */}
        <div className="space-y-6">
          {accounts.map((account) => (
            <div key={account.type} className="group cursor-pointer">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-lg font-bold">{account.type}</h3>
                  <p className="text-muted-foreground text-sm">
                    {account.balance} total • {account.count}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <div className="h-px bg-border/50 mt-4 group-last:hidden" />
            </div>
          ))}
        </div>

        {/* Settings Links */}
        <div className="mt-10 overflow-hidden rounded-xl border border-border/50 bg-card">

          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border/50">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Security & Privacy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>


        {/* Transfer Button - Sticky Bottom or just at bottom */}
        <div className="mt-12 mb-8">
          <Button className="w-full rounded-full py-6 text-base font-bold bg-[#ff2b6d] hover:bg-[#ff2b6d]/90 text-white shadow-lg shadow-[#ff2b6d]/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            Transfer
          </Button>
        </div>
      </main>
    </div>
  );
}
