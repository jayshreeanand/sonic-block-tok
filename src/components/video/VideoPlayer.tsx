"use client";

import { useState, useEffect, useRef } from "react";
import { Video } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Coins, 
  Heart, 
  MessageCircle, 
  Share2,
  ShoppingBag
} from "lucide-react";

interface VideoPlayerProps {
  video: Video;
  autoPlay?: boolean;
}

export function VideoPlayer({ video, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  // Simulated token earning rate (tokens per second)
  const tokenRate = 0.5;
  const tokenInterval = useRef<NodeJS.Timeout | null>(null);

  // Sets hasMounted to true once the component mounts in the browser
  useEffect(() => {
    setHasMounted(true);
    
    // Auto-play the video when the component mounts if autoPlay is true
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Auto-play failed:", error);
        setIsPlaying(false);
      });
    }
  }, [autoPlay]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleTimeUpdate = () => {
      if (videoElement.duration) {
        setCurrentTime(videoElement.currentTime);
        setProgress((videoElement.currentTime / videoElement.duration) * 100);
      }
    };
    
    const handleDurationChange = () => {
      setDuration(videoElement.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("durationchange", handleDurationChange);
    videoElement.addEventListener("ended", handleEnded);
    
    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("durationchange", handleDurationChange);
      videoElement.removeEventListener("ended", handleEnded);
      
      if (tokenInterval.current) {
        clearInterval(tokenInterval.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.play().catch(() => setIsPlaying(false));
      
      // Start earning tokens
      tokenInterval.current = setInterval(() => {
        setEarnedTokens(prev => prev + tokenRate);
      }, 1000);
    } else {
      videoRef.current.pause();
      
      // Stop earning tokens
      if (tokenInterval.current) {
        clearInterval(tokenInterval.current);
      }
    }
    
    return () => {
      if (tokenInterval.current) {
        clearInterval(tokenInterval.current);
      }
    };
  }, [isPlaying, tokenRate]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    videoRef.current.currentTime = newTime;
  };
  
  // Use a deterministic formatting function for time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  
  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-auto"
        playsInline
        muted={isMuted}
        poster={video.thumbnail}
        onClick={togglePlay}
      />
      
      {/* Token earning indicator */}
      {isPlaying && hasMounted && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 rounded-full py-1 px-3 text-white">
          <Coins className="h-4 w-4 text-amber-400" />
          <span className="text-amber-400 font-medium">+{earnedTokens.toFixed(1)}</span>
        </div>
      )}
      
      {/* Video controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Progress bar */}
        <div 
          className="relative h-1 w-full bg-gray-600 rounded-full cursor-pointer mb-2"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-amber-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="p-1">
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white" />
              )}
            </button>
            <button onClick={toggleMute} className="p-1">
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-white" />
              ) : (
                <Volume2 className="h-5 w-5 text-white" />
              )}
            </button>
            {hasMounted && (
              <span className="text-sm text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="p-1"
            >
              <Heart 
                className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} 
              />
            </button>
            <button className="p-1">
              <MessageCircle className="h-5 w-5 text-white" />
            </button>
            <button className="p-1">
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
      
      {/* NFT purchase button */}
      {video.isNFT && (
        <Card className="absolute top-4 left-4 bg-black/70 border-0">
          <Button variant="primary" size="sm" className="flex items-center gap-1">
            <ShoppingBag className="h-4 w-4" />
            <span>Buy NFT • {video.nftPrice} INJ</span>
          </Button>
        </Card>
      )}
      
      {/* Play button overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="token"
            size="lg"
            className="rounded-full h-16 w-16 flex items-center justify-center"
            onClick={togglePlay}
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
      )}
    </div>
  );
} 