'use client';

import { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/lib/theme';
import { LanguageProvider } from '@/lib/i18n';
import { ToastProvider } from '@/components/ui';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { UpdatePrompt } from '@/components/pwa/UpdatePrompt';
import { registerServiceWorker, setupInstallPrompt } from '@/lib/pwa/serviceWorker';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function PWAProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Register service worker
    registerServiceWorker();
    // Setup install prompt handler
    setupInstallPrompt();
  }, []);

  return (
    <>
      {children}
      <InstallPrompt />
      <UpdatePrompt />
    </>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <PWAProvider>{children}</PWAProvider>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
