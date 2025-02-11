
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { MonthProvider } from "@/contexts/MonthContext";
import { routes } from "@/config/routes";
import { Skeleton } from "@/components/ui/skeleton";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 10 * 60 * 1000, // 10 minutes
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
});

// Lazy load routes
const AppRoutes = lazy(() => {
  const element = useRoutes(routes);
  return Promise.resolve({ default: () => element });
});

const LoadingFallback = () => (
  <div className="p-4">
    <Skeleton className="h-8 w-[200px] mb-4" />
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const AppContent = () => (
  <TooltipProvider>
    <MonthProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={<LoadingFallback />}>
        <AppRoutes />
      </Suspense>
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
