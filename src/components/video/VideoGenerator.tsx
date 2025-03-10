"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, AlertCircle, Check, Loader2, PlayCircle, Download, Video, Wand2, Coins } from "lucide-react";

// Update prompt suggestions to be more suitable for Vadoo AI
const PROMPT_SUGGESTIONS = [
  "A modern tech company office with employees collaborating in a bright, open space",
  "A sleek electric car driving through a futuristic city at night with neon lights",
  "A professional business meeting with diverse team members presenting data on screens",
  "A fitness enthusiast working out in a modern gym with high-tech equipment",
  "A chef preparing gourmet dishes in a contemporary kitchen with modern appliances"
];

// Default prompt to avoid hydration issues
const DEFAULT_PROMPT = PROMPT_SUGGESTIONS[0];

// Generation states
type GenerationState = "idle" | "generating" | "processing" | "completed" | "failed";

interface VideoGeneratorProps {
  onVideoGenerated?: (videoUrl: string, thumbnailUrl: string) => void;
}

export function VideoGenerator({ onVideoGenerated }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [generationState, setGenerationState] = useState<GenerationState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedThumbnailUrl, setGeneratedThumbnailUrl] = useState<string | null>(null);
  const [matchedVideoTitle, setMatchedVideoTitle] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Only run on client-side to avoid hydration errors
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Use a random suggestion, but only after mounting on client
  useEffect(() => {
    if (hasMounted) {
      const randomIndex = Math.floor(Math.random() * PROMPT_SUGGESTIONS.length);
      setPrompt(PROMPT_SUGGESTIONS[randomIndex]);
    }
  }, [hasMounted]);

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    };
  }, []);

  // Function to simulate job progress (for demo purposes)
  const simulateJobProgress = () => {
    let currentProgress = 10;
    
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
    }
    
    statusCheckInterval.current = setInterval(() => {
      if (currentProgress >= 100) {
        clearInterval(statusCheckInterval.current!);
        setGenerationState("completed");
        setProgress(100);
        return;
      }
      
      // Increase progress by random amount
      const increment = Math.floor(Math.random() * 15) + 5;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(statusCheckInterval.current!);
        setGenerationState("completed");
      }
    }, 800); // Update every 800ms for a nice progression
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for the video generation");
      return;
    }

    try {
      setError(null);
      setProgress(0);
      setIsVideoLoaded(false);
      setIsVideoPlaying(false);
      setJobId(null);
      setGenerationState("generating");
      setProgress(10);

      // Call our API endpoint
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate video');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate video');
      }
      
      // Set state to processing
      setGenerationState("processing");
      setJobId(data.vid);
      
      // Start progress simulation
      simulateJobProgress();

      // Update state with generated video
      setGeneratedVideoUrl(data.videoUrl);
      setGeneratedThumbnailUrl(data.thumbnailUrl);
      setMatchedVideoTitle(data.title || prompt);

      // Notify parent component if callback is provided
      if (onVideoGenerated) {
        onVideoGenerated(data.videoUrl, data.thumbnailUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate video. Please try again.");
      setGenerationState("failed");
      console.error("Video generation error:", err);
    }
  };

  const handleTryAgain = () => {
    setGeneratedVideoUrl(null);
    setGeneratedThumbnailUrl(null);
    setMatchedVideoTitle(null);
    setError(null);
    setProgress(0);
    setIsVideoLoaded(false);
    setIsVideoPlaying(false);
    setGenerationState("idle");
    setJobId(null);
    
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
    }
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleDownload = () => {
    if (generatedVideoUrl) {
      const a = document.createElement('a');
      a.href = generatedVideoUrl;
      a.download = `blocktok-ai-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // Handle video events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);
    const handleEnded = () => setIsVideoPlaying(false);

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Status message based on generation state
  const getStatusMessage = () => {
    switch (generationState) {
      case "generating":
        return "Preparing to generate your video...";
      case "processing":
        return "AI is creating your video... This may take a few minutes.";
      case "completed":
        return "Video generated successfully!";
      case "failed":
        return "Generation failed. Please try again.";
      default:
        return "";
    }
  };

  const isGenerating = generationState === "generating" || generationState === "processing";

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-500" />
          <span>Generate AI Video</span>
        </h2>
        
        {/* Text prompt input */}
        <div className="mb-4">
          <label htmlFor="prompt" className="block mb-2 font-medium">
            Describe your video in detail
          </label>
          <textarea
            id="prompt"
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="A breathtaking aerial view of a futuristic city with flying cars..."
            value={prompt}
            onChange={handlePromptChange}
            disabled={isGenerating}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Be specific and detailed. Include visual elements, style, actions, and mood. For better results, aim for 500-1000 characters.
          </p>
        </div>

        {/* Prompt Suggestions */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Try these prompts:</p>
          <div className="flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setPrompt(suggestion)}
                className="text-xs px-2 py-1 bg-accent/50 rounded-full hover:bg-accent transition-colors"
                disabled={isGenerating}
              >
                {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Settings for Vadoo */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Voice</label>
            <select 
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isGenerating}
            >
              <option value="Charlie">Charlie (Default)</option>
              <option value="Emma">Emma</option>
              <option value="Brian">Brian</option>
              <option value="Olivia">Olivia</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Duration</label>
            <select 
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isGenerating}
            >
              <option value="5">5 seconds</option>
              <option value="30-60">30-60 seconds</option>
              <option value="60-90">60-90 seconds</option>
              <option value="90-120">90-120 seconds</option>
            </select>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {/* Generation progress */}
        {isGenerating && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{getStatusMessage()}</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground animate-pulse">
              Vadoo AI is processing your request. This typically takes a few seconds.
            </p>
            {jobId && (
              <p className="mt-1 text-xs text-muted-foreground">
                Job ID: {jobId}
              </p>
            )}
          </div>
        )}
        
        {/* Generate button */}
        <div className="flex gap-2">
          {!generatedVideoUrl ? (
            <Button
              variant="primary"
              className="w-full"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Generate Video</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleTryAgain}
            >
              Generate Another Video
            </Button>
          )}
        </div>
      </div>
      
      {/* Generated video preview */}
      {generatedVideoUrl && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <h3 className="font-medium">Video Generated Successfully!</h3>
            </div>
            
            {matchedVideoTitle && (
              <div className="mb-2 text-lg font-semibold text-center">
                {matchedVideoTitle}
              </div>
            )}
            
            <div className="rounded-lg overflow-hidden bg-black aspect-video mb-4 relative">
              <video
                ref={videoRef}
                src={generatedVideoUrl}
                poster={generatedThumbnailUrl || undefined}
                controls
                className="w-full h-full"
                onLoadedData={handleVideoLoad}
                preload="auto"
              />
              
              {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
              
              {isVideoLoaded && !isVideoPlaying && (
                <button 
                  onClick={toggleVideoPlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
                >
                  <PlayCircle className="h-16 w-16 text-white" />
                </button>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button variant="outline" size="sm" onClick={handleDownload} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                <span>Download Video</span>
              </Button>
              <Button variant="token" size="sm" className="flex-1">
                <Coins className="mr-2 h-4 w-4" />
                <span>Mint as NFT (0.2 INJ)</span>
              </Button>
              <Button variant="primary" size="sm" className="flex-1">
                <Video className="mr-2 h-4 w-4" />
                <span>Publish to Feed</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 