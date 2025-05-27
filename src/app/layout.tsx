import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'], // Common weights
  fallback: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'sans-serif'],
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: 'だーいしのかるた',
  description: 'だーいしのかるたアプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} antialiased font-sans flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
