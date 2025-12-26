'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider
        session={null}
        refetchInterval={0} // Disable automatic refetch to prevent session loss
        refetchOnWindowFocus={false}
        refetchWhenOffline={false}
      >
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}