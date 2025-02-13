
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

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: List
  },
  {
    name: "Budget",
    href: "/budget",
    icon: PieChart
  },
  {
    name: "Reminders",
    href: "/reminders",
    icon: Bell
  },
  {
    name: "Income",
    href: "/income",
    icon: Wallet
  }
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start")}
                onClick={() => navigate(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
