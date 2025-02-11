
import React, { PropsWithChildren, useMemo } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Creates a wrapper provider for testing components that use React Query
 * @param children Components to be wrapped
 * @returns Wrapped components with QueryClientProvider
 */
function createWrapper({ children }: PropsWithChildren) {
  // Memoize queryClient to prevent unnecessary re-renders
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // Add caching configuration for better performance
        staleTime: 5000, // Data considered fresh for 5 seconds
        cacheTime: 10 * 60 * 1000, // Cache data for 10 minutes
      },
    },
  }), []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Custom render function that includes necessary providers
 * @param ui Component to render
 * @param options Additional render options
 * @returns Rendered component with all required providers
 */
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: createWrapper,
    ...options,
  });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

