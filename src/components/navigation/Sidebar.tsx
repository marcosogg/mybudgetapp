
import { Home, PieChart, List, Bell, Wallet, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, Settings } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useProfile();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Transactions", href: "/transactions", icon: List },
    { name: "Categories", href: "/categories", icon: PieChart },
    { name: "Budget", href: "/budget", icon: Wallet },
    { name: "Savings Goals", href: "/savings-goals", icon: Target },
    { name: "Reminders", href: "/reminders", icon: Bell },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="shrink-0 p-6">
        <img 
          src="/MyBudget-logo.svg"
          alt="MyBudget Logo"
          className="h-16 w-auto"
        />
      </div>
      
      <div className="flex flex-col h-full">
        <nav className="px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-colors",
                  isActive ? "bg-secondary hover:bg-secondary/80" : "hover:bg-secondary/10"
                )}
                onClick={() => navigate(item.href)}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Button>
            );
          })}
        </nav>

        <div className="mt-4 px-4">
          <div className="border-t mb-4" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="w-full flex justify-between px-2">
                <div className="flex items-center gap-2">
                  <CircleUserRound size={20} className="text

-muted-foreground" />
                  <span className="text-sm font-medium">Account</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start" alignOffset={11} sideOffset={8}>
              <DropdownMenuLabel className="flex items-center gap-3 px-3 py-2">
                <CircleUserRound className="h-8 w-8 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium leading-none">
                    {profile?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {profile?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="gap-3">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="gap-3">
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1"></div>
      </div>
    </div>
  );
}
