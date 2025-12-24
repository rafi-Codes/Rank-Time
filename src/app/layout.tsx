// src/app/layout.tsx
'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider
            session={null}
            refetchInterval={5 * 60} // Refetch session every 5 minutes
            refetchOnWindowFocus={true}
            refetchWhenOffline={false}
          >
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}