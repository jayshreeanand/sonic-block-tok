"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatAddress } from "@/lib/utils";
import { Home, TrendingUp, Compass, Plus, Wallet, Bell, LogOut, LogIn } from "lucide-react";
import { users } from "@/lib/mock-data";

export function Navbar() {
  const pathname = usePathname();
  const [isConnected, setIsConnected] = useState(false);
  const mockUser = users[0];

  // Mock wallet connection
  const handleConnectWallet = () => {
    setIsConnected(true);
  };

  const handleDisconnectWallet = () => {
    setIsConnected(false);
  };

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Trending", href: "/trending", icon: TrendingUp },
    { label: "Create", href: "/create", icon: Plus },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-600" />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">B</div>
            </div>
            <span className="text-xl font-bold">BlockTok</span>
          </Link>

          <nav className="hidden md:flex">
            <ul className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <>
              <div className="hidden md:flex items-center gap-1 rounded-full bg-primary/10 px-4 py-1 text-primary">
                <Wallet className="h-4 w-4" />
                <span>{formatAddress(mockUser.walletAddress)}</span>
              </div>
              
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    3
                  </span>
                </Button>
              </Link>
              
              <Link href="/profile" className="flex items-center gap-2">
                <Avatar 
                  src={mockUser.avatar} 
                  alt={mockUser.displayName} 
                  size="sm" 
                  fallback={mockUser.displayName} 
                />
                <span className="hidden md:inline font-medium">
                  {mockUser.displayName}
                </span>
              </Link>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDisconnectWallet}
                className="hidden md:flex"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button onClick={handleConnectWallet} variant="primary">
              <LogIn className="mr-2 h-4 w-4" />
              <span>Connect Wallet</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 