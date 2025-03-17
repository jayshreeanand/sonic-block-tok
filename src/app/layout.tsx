import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'sonner';
import { WalletProviders } from '@/components/WalletProviders';
import { BlockchainProvider } from '@/components/BlockchainProvider';
import { NavBar } from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BlockTok - Decentralized Content Platform',
  description: 'A decentralized content platform built on Solana blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProviders>
            <BlockchainProvider>
              <div className="flex flex-col min-h-screen">
                <NavBar />
                <main className="flex-1">
                  {children}
                </main>
                <footer className="py-6 border-t">
                  <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    <p>© 2023 BlockTok. All rights reserved.</p>
                    <p className="mt-1">Powered by Solana blockchain.</p>
                  </div>
                </footer>
              </div>
              <Toaster position="bottom-right" />
            </BlockchainProvider>
          </WalletProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
