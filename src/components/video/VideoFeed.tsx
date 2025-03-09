"use client";

import { useState, useRef } from "react";
import { VideoCard } from "./VideoCard";
import { Video } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { videos as mockVideos } from "@/lib/mock-data";

interface VideoFeedProps {
  title?: string;
  videos?: Video[];
  viewType?: "grid" | "feed";
  limit?: number;
}

export function VideoFeed({
  title,
  videos = mockVideos,
  viewType = "grid",
  limit,
}: VideoFeedProps) {
  const displayVideos = limit ? videos.slice(0, limit) : videos;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, clientWidth } = scrollRef.current;
    const newPosition = direction === "left" 
      ? Math.max(0, scrollLeft - clientWidth) 
      : scrollLeft + clientWidth;
    
    scrollRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
    
    setScrollPosition(newPosition);
  };

  if (viewType === "feed") {
    return (
      <div className="flex flex-col gap-6">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        {displayVideos.map((video) => (
          <VideoCard key={video.id} video={video} layoutType="feed" />
        ))}
      </div>
    );
  }

  const hasOverflow = displayVideos.length > 4;

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          {hasOverflow && (
            <div className="flex gap-2">
              <button
                onClick={() => handleScroll("left")}
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                disabled={scrollPosition === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayVideos.map((video) => (
          <div
            key={video.id}
            className="w-full min-w-[280px] max-w-[350px] flex-none"
          >
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </div>
  );
} 