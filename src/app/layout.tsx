// src/app/layout.tsx

import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

// Metadata for the app
export const metadata: Metadata = {
  title: 'Rank Time - Unleash skills beyond the clock',
  description: 'Track your competitive programming journey, analyze your performance, and climb the ranks with data-driven insights.',
  keywords: ['competitive programming', 'coding', 'algorithm', 'ranking', 'progress tracking'],
  authors: [{ name: 'Rafiul Hasan' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}