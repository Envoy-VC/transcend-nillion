import React, { type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Libp2pProvider } from '~/providers';
import { Toaster } from '~/components/ui/sonner';

const queryClient = new QueryClient();

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Libp2pProvider>
        {children}

        <Toaster />
      </Libp2pProvider>
    </QueryClientProvider>
  );
};
