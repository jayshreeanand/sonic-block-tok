"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateVideoFromText } from "@/lib/textToVideoApi";
import { Sparkles, AlertCircle, Check, Loader2 } from "lucide-react";

interface VideoGeneratorProps {
  onVideoGenerated?: (videoUrl: string, thumbnailUrl: string) => void;
}

export function VideoGenerator({ onVideoGenerated }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedThumbnailUrl, setGeneratedThumbnailUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for the video generation");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.floor(Math.random() * 10);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      // Call the API to generate the video
      const result = await generateVideoFromText(prompt);

      // Clear the interval and set progress to 100%
      clearInterval(progressInterval);
      setProgress(100);

      // Update state with generated video
      setGeneratedVideoUrl(result.videoUrl);
      setGeneratedThumbnailUrl(result.thumbnailUrl);

      // Notify parent component if callback is provided
      if (onVideoGenerated) {
        onVideoGenerated(result.videoUrl, result.thumbnailUrl);
      }
    } catch (err) {
      setError("Failed to generate video. Please try again.");
      console.error("Video generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTryAgain = () => {
    setGeneratedVideoUrl(null);
    setGeneratedThumbnailUrl(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-xl font-bold mb-4">Generate AI Video</h2>
        
        {/* Text prompt input */}
        <div className="mb-4">
          <label htmlFor="prompt" className="block mb-2 font-medium">
            Describe your video
          </label>
          <textarea
            id="prompt"
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="A beautiful sunset over mountains with birds flying by..."
            value={prompt}
            onChange={handlePromptChange}
            disabled={isGenerating}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Be specific and descriptive for best results. Include details about scenery, subjects, actions, and style.
          </p>
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
              <span className="text-sm font-medium">Generating video...</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground animate-pulse">
              This may take a minute. AI is working its magic...
            </p>
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
            
            <div className="rounded-lg overflow-hidden bg-black aspect-video mb-4">
              <video
                ref={videoRef}
                src={generatedVideoUrl}
                poster={generatedThumbnailUrl || undefined}
                controls
                className="w-full h-full"
              />
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" size="sm">
                Download Video
              </Button>
              <Button variant="primary" size="sm">
                Use This Video
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 