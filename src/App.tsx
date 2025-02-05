import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { MonthProvider } from "@/contexts/MonthContext";
import { routes } from "@/config/routes";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return useRoutes(routes);
};

const AppContent = () => (
  <TooltipProvider>
    <MonthProvider>
      <Toaster />
      <Sonner />
      <AppRoutes />
    </MonthProvider>
  </TooltipProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;