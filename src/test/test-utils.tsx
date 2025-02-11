
import React, { PropsWithChildren, useMemo } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function createWrapper({ children }: PropsWithChildren) {
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 30000, // Data stays fresh for 30 seconds
        gcTime: 1800000, // Cache data for 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  }), []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: createWrapper,
    ...options,
  });
}

export * from '@testing-library/react';
export { customRender as render };
