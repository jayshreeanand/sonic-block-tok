"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, User } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Create", href: "/create", icon: Plus },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center h-full ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`h-6 w-6 ${
                  item.label === "Create" ? "bg-gradient-to-r from-purple-500 to-blue-600 p-1 text-white rounded-full" : ""
                }`}
              />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 