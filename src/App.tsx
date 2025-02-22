
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { MonthProvider } from "@/contexts/MonthContext";
import { routes } from "@/config/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { IntercomProvider } from "@/components/providers/IntercomProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      gcTime: 1800000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

function Routes() {
  return useRoutes(routes);
}

const LazyRoutes = lazy(() => Promise.resolve({ default: Routes }));

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

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
    <p className="text-muted-foreground mb-4">{error.message}</p>
    <Button onClick={resetErrorBoundary}>Try again</Button>
  </div>
);

const AppContent = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <TooltipProvider>
      <MonthProvider>
        <IntercomProvider>
          <Toaster />
          <Sonner />
          <Suspense fallback={<LoadingFallback />}>
            <LazyRoutes />
          </Suspense>
        </IntercomProvider>
      </MonthProvider>
    </TooltipProvider>
  </ErrorBoundary>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
