import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Toaster } from "@/components/ui/toaster"


export const metadata: Metadata = {
  title: 'だーいしのかるた',
  description: 'だーいしのかるたアプリ',
};

const isPaid = process.env.ISHIDA_PAID === 'true';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen">
        {!isPaid ? (
          <div className="flex items-center justify-center min-h-screen text-4xl font-bold">
            お金くれるなら、追加機能も含めて公開してあげる
          </div>
        ) : (
          <>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster />
          </>
        )}
      </body>
    </html>
  );
}
