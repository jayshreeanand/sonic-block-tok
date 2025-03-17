import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'sonner';
import { WalletProviders } from '@/components/WalletProviders';
import { BlockchainProvider } from '@/components/BlockchainProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BlockTok - AI Video Creator with Blockchain Integration',
  description: 'Create AI videos and manage them on the blockchain for proof of ownership and monetization',
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
              <div className="relative flex min-h-screen flex-col">
                <div className="flex-1">{children}</div>
                <footer className="py-6 md:px-8 md:py-0">
                  <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                      Built with ❤️ for Solana
                    </p>
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
