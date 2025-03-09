"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
} 