"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { Video } from "@/lib/types";
import { Heart, MessageCircle, Share2, Coins } from "lucide-react";

interface VideoCardProps {
  video: Video;
  layoutType?: "grid" | "feed";
}

export function VideoCard({ video, layoutType = "grid" }: VideoCardProps) {
  const {
    id,
    title,
    thumbnail,
    creator,
    likes,
    comments,
    shares,
    tokens,
    isNFT,
    nftPrice,
    duration,
  } = video;

  // Format duration in a deterministic way
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-lg ${
        layoutType === "grid"
          ? "w-full"
          : "w-full max-w-3xl border-0 shadow-none"
      }`}
    >
      <Link href={`/video/${id}`} className="block">
        <div
          className={`relative ${
            layoutType === "grid" ? "aspect-video" : "aspect-[9/16]"
          } overflow-hidden rounded-t-lg`}
        >
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {duration && (
            <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
              {formatDuration(duration)}
            </div>
          )}
          {isNFT && (
            <div className="absolute left-2 top-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-600 px-2 py-1 text-xs font-bold text-white">
              NFT {nftPrice ? `• ${nftPrice} INJ` : ""}
            </div>
          )}
        </div>
      </Link>
      <CardContent
        className={`flex flex-col gap-2 ${
          layoutType === "feed" ? "px-0 pb-6" : ""
        }`}
      >
        <div className="mt-3 flex justify-between gap-2">
          <Link href={`/profile/${creator.username}`} className="flex items-center gap-2">
            <Avatar src={creator.avatar} alt={creator.displayName} size="sm" fallback={creator.displayName} />
            <span className="font-medium">{creator.displayName}</span>
          </Link>
          {layoutType === "grid" && (
            <Button variant="token" size="sm">
              <Coins className="mr-1 h-4 w-4" />
              <span>Earn</span>
            </Button>
          )}
        </div>
        <h3 className="line-clamp-2 text-base font-medium">{title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{formatNumber(likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{formatNumber(comments)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span>{formatNumber(shares)}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Coins className="h-4 w-4" />
            <span>{formatNumber(tokens)}</span>
          </div>
        </div>
        {layoutType === "feed" && (
          <div className="mt-2 flex gap-2">
            <Button variant="token" className="flex-1">
              <Coins className="mr-1 h-4 w-4" />
              <span>Earn Tokens</span>
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 