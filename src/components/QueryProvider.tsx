'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Data dianggap "segar" selama 10 menit (gak bakal fetch ulang kalau belum 10 menit)
        staleTime: 10 * 60 * 1000, 
        // Data disimpen di cache selama 30 menit kalau gak dipake
        gcTime: 30 * 60 * 1000,
        // Retry 1x aja kalau gagal
        retry: 1,
        refetchOnWindowFocus: false, // Gak usah refresh pas pindah tab browser
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
