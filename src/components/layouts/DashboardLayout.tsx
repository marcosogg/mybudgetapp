
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Sidebar } from "../navigation/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout = ({ children, className }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-72 border-r border-border bg-background z-30">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed left-4 top-4 z-40 lg:hidden h-10 w-10"
              aria-label="Toggle Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="p-0 w-72 bg-background"
            onPointerDownOutside={() => setIsSidebarOpen(false)}
          >
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className={cn(
        "min-h-screen lg:pl-72 pt-16 lg:pt-0",
        "transition-all duration-300 ease-in-out",
        className
      )}>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
