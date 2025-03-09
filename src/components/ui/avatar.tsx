"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src?: string;
    alt?: string;
    size?: "sm" | "md" | "lg";
    fallback?: string;
  }
>(({ className, src, alt = "", size = "md", fallback, ...props }, ref) => {
  const [error, setError] = React.useState(false);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-blue-600",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !error ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <span className="text-lg font-semibold">
            {fallback ? fallback.charAt(0).toUpperCase() : "U"}
          </span>
        </div>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export { Avatar }; 