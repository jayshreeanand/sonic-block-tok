"use client";

import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import { WalletProvider } from "@/contexts/WalletContext";
import { ConnectButton } from "../wallet/ConnectButton";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <WalletProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar>
          <div className="ml-auto">
            <ConnectButton size="sm" variant="outline" />
          </div>
        </Navbar>
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <MobileNav />
      </div>
    </WalletProvider>
  );
} 