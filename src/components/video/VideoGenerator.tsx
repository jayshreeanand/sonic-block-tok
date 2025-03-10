"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, AlertCircle, Check, Loader2, Wand2, Coins } from "lucide-react";

// Add demo videos data
const DEMO_VIDEOS = [
  {
    title: "Life of street artist",
    url: "https://res.cloudinary.com/dlgztvq9v/video/upload/v1742413050/block-tok-videos/life-of-street-artist_wvxhnd.mp4",
    thumbnail: "https://res.cloudinary.com/dlgztvq9v/video/upload/v1742413050/block-tok-videos/life-of-street-artist_wvxhnd.jpg"
  },
  {
    title: "Engaging story of team work",
    url: "https://res.cloudinary.com/dlgztvq9v/video/upload/v1742413071/block-tok-videos/engaging-story-teamwork_ckhtp0.mp4",
    thumbnail: "https://res.cloudinary.com/dlgztvq9v/video/upload/v1742413071/block-tok-videos/engaging-story-teamwork_ckhtp0.jpg"
  },
  {
    title: "Gym of the future",
    url: "https://res.cloudinary.com/dlgztvq9v/video/upload/v1742413048/block-tok-videos/gym-of-future_iz0wwh.mp4",
    thumbnail: "https://res.cloudinary.com/dlgztvq9v/video/upload/v1742413048/block-tok-videos/gym-of-future_iz0wwh.jpg"
  }
];

// Default prompt to avoid hydration issues
const DEFAULT_PROMPT = DEMO_VIDEOS[0].title;

// Generation states
type GenerationState = "idle" | "generating" | "processing" | "completed" | "failed";

interface VideoGeneratorProps {
  onVideoGenerated: (data: {
    vid: string;
    videoUrl: string;
    thumbnailUrl: string;
    title: string;
    theme: string;
  }) => void;
}

export function VideoGenerator({ onVideoGenerated }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [generationState, setGenerationState] = useState<GenerationState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [selectedDemoVideo, setSelectedDemoVideo] = useState<typeof DEMO_VIDEOS[0] | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<{
    vid: string;
    videoUrl: string;
    thumbnailUrl: string;
    title: string;
    theme: string;
  } | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Only run on client-side to avoid hydration errors
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Use a random demo video, but only after mounting on client
  useEffect(() => {
    if (hasMounted) {
      const randomIndex = Math.floor(Math.random() * DEMO_VIDEOS.length);
      setSelectedDemoVideo(DEMO_VIDEOS[randomIndex]);
      setPrompt(DEMO_VIDEOS[randomIndex].title);
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

  const handleGenerate = async () => {
    try {
      setError(null);
      setProgress(0);
      setGenerationState("generating");

      // If a demo video is selected, use it instead of calling the API
      if (selectedDemoVideo) {
        setProgress(100);
        setGenerationState("completed");
        
        // Simulate a small delay to show the progress
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const videoData = {
          vid: "demo-" + Date.now(),
          videoUrl: selectedDemoVideo.url,
          thumbnailUrl: selectedDemoVideo.thumbnail,
          title: selectedDemoVideo.title,
          theme: "None"
        };
        
        setGeneratedVideo(videoData);
        onVideoGenerated(videoData);
        return;
      }

      // For custom prompts, continue with the API call
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate video");
      }

      const data = await response.json();
      setGeneratedVideo(data);
      onVideoGenerated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate video. Please try again.");
      setGenerationState("failed");
    }
  };

  const handleTryAgain = () => {
    setGenerationState("idle");
    setJobId(null);
    setGeneratedVideo(null);
    setSelectedDemoVideo(null);
  };

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
            Describe your video
          </label>
          <textarea
            id="prompt"
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="A breathtaking aerial view of a futuristic city with flying cars..."
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setSelectedDemoVideo(null); // Clear demo video selection when user types
            }}
            disabled={isGenerating}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Be specific and detailed. Include visual elements, style, actions, and mood. For better results, aim for 500-1000 characters.
          </p>
        </div>

        {/* Quick Select Demo Videos */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Try these videos:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {DEMO_VIDEOS.map((video) => (
              <button
                key={video.title}
                onClick={() => {
                  setSelectedDemoVideo(video);
                  setPrompt(video.title);
                }}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedDemoVideo?.title === video.title
                    ? 'border-primary bg-primary/5'
                    : 'border-input hover:bg-accent/50'
                }`}
                disabled={isGenerating}
              >
                <h3 className="font-medium text-sm">{video.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">Click to use this prompt</p>
              </button>
            ))}
          </div>
        </div>

        {/* Settings for Vadoo */}
        <div className="mb-4">
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
              Vadoo AI is processing your request. This typically takes a 2-3 minutes. So please be patient.
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
          {!isGenerating && (
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
          )}
        </div>
      </div>
      
      {/* Generated video preview */}
      {generationState === "completed" && generatedVideo && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <Check className="h-5 w-5" />
              <h3 className="font-medium">Video Generated Successfully!</h3>
            </div>
            
            <div className="rounded-lg overflow-hidden bg-black aspect-video mb-4">
              <video
                src={generatedVideo.videoUrl}
                poster={generatedVideo.thumbnailUrl}
                controls
                className="w-full h-full"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button variant="outline" size="sm" onClick={handleTryAgain} className="flex-1">
                Generate Another Video
              </Button>
              <Button variant="token" size="sm" className="flex-1">
                <Coins className="mr-2 h-4 w-4" />
                <span>Mint as NFT</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 