
import { Home, PieChart, List, Bell, Wallet } from "lucide-react";
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
    <div className="h-full p-4 space-y-4 flex flex-col bg-background">
      <div className="mb-8">
        <img 
          src="/lovable-uploads/72022642-78a3-4ff9-a14c-48acb8e1f402.png" 
          alt="MyBudget Logo" 
          className="h-8 w-auto"
        />
      </div>
      <nav className="space-y-1.5">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "nav-item w-full justify-start gap-2",
                isActive && "nav-item-active"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-[#1877F2]")} />
              {item.name}
            </Button>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="w-full flex justify-between px-2">
              <div className="flex items-center gap-2">
                <CircleUserRound size={20} className="text-muted-foreground" />
                <span className="text-sm font-medium">Account</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start" alignOffset={11} sideOffset={8}>
            <DropdownMenuLabel className="flex items-start gap-3">
              <CircleUserRound size={32} className="shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-foreground">
                  {profile?.name}
                </span>
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {profile?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
