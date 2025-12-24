import React from 'react';
import { Inter } from 'next/font/google';
import QueryProvider from '@/components/QueryProvider';
import FloatingNav from '@/components/FloatingNav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Drama Stream',
  description: 'Stream Asian Drama',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
          <meta name="description" content="Stream Asian Drama" />
      </head>
      <body className="font-sans bg-[#000000] text-[#f5f5f7] min-h-screen antialiased selection:bg-white selection:text-black">
        <QueryProvider>
          <main className="min-h-screen relative bg-black">
            {children}
          </main>
          
          <FloatingNav />
        </QueryProvider>
      </body>
    </html>
  );
}
