import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const font = Inter({ subsets: ['latin'] });

import { Toaster } from '@/components/ui/sonner';
import { Banner } from '@/components/banner/banner';

export const metadata: Metadata = {
  title: 'iSave',
  description: 'Finance Budget AI App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`flex flex-row ${font.className}`}>
        {children}
        <Toaster richColors />
        <Banner />
      </body>
    </html>
  );
}
