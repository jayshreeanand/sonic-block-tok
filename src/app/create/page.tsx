"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VideoGenerator } from "@/components/video/VideoGenerator";
import { 
  Sparkles, 
  Upload, 
  MessageSquare, 
  BookText,
  Video,
  Code,
  Share2,
  AlertCircle,
  Coins,
  Palette
} from "lucide-react";

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<'prompt' | 'upload' | 'template'>('prompt');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedThumbnailUrl, setGeneratedThumbnailUrl] = useState<string | null>(null);

  const handleVideoGenerated = (videoUrl: string, thumbnailUrl: string) => {
    setGeneratedVideoUrl(videoUrl);
    setGeneratedThumbnailUrl(thumbnailUrl);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create AI Video</h1>
          <p className="text-muted-foreground">
            Generate unique short-form videos using AI and earn tokens
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Create Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Navigation */}
            <div className="flex border-b">
              <button
                className={`px-4 py-2 border-b-2 ${
                  activeTab === 'prompt'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('prompt')}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Text to Video</span>
                </div>
              </button>
              <button
                className={`px-4 py-2 border-b-2 ${
                  activeTab === 'upload'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('upload')}
              >
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </div>
              </button>
              <button
                className={`px-4 py-2 border-b-2 ${
                  activeTab === 'template'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('template')}
              >
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Templates</span>
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'prompt' && (
                <VideoGenerator onVideoGenerated={handleVideoGenerated} />
              )}

              {activeTab === 'upload' && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Upload Video</h2>
                    <div className="flex items-center justify-center h-64 rounded-md border border-dashed border-input bg-background p-4">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <h3 className="font-medium">Drag and drop your video file</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Support for MP4, MOV, AVI up to 100MB
                        </p>
                        <Button variant="outline">
                          Select Video
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'template' && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Video Templates</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {['Product Showcase', 'Social Media Ad', 'Tutorial', 'Announcement', 'Meme', 'NFT Reveal'].map((template) => (
                        <Card key={template} className="cursor-pointer hover:shadow-md transition-shadow">
                          <div className="aspect-video bg-accent/30 rounded-t-lg flex items-center justify-center">
                            <Video className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-medium">{template}</h3>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Video Generation Form - this section is kept for reference */}
            {false && (
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Video Description</label>
                    <textarea
                      placeholder="Describe the video you want to generate in detail..."
                      className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Be specific about style, subjects, colors, lighting, movement, mood, etc.
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Style Presets</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {["Cinematic", "3D Animation", "Anime", "Realistic", "Abstract", "Neon", "Vintage", "Futuristic"].map((style) => (
                        <div
                          key={style}
                          className="rounded-md border border-input bg-background px-3 py-2 text-center cursor-pointer hover:bg-accent"
                        >
                          {style}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Categories</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {["AI Art", "Music", "Tech", "Fashion", "Gaming", "Education", "Comedy", "Crypto"].map((category) => (
                        <div
                          key={category}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`category-${category}`}
                            className="h-4 w-4 rounded border-input"
                          />
                          <label htmlFor={`category-${category}`}>{category}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Video Duration</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="15">15 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="60">60 seconds</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Reference Image (Optional)</label>
                    <div className="flex items-center justify-center h-32 rounded-md border border-dashed border-input bg-background p-4">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Drag and drop or click to upload
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="primary" size="lg" className="flex-1">
                      <Sparkles className="mr-2 h-5 w-5" />
                      <span>Generate Video</span>
                    </Button>
                    <Button variant="outline" size="lg">
                      <Video className="mr-2 h-5 w-5" />
                      <span>Preview</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creation Options */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold mb-4">Creation Options</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="h-4 w-4 rounded" />
                      <span>Create as NFT</span>
                    </label>
                    <div className="text-xs text-muted-foreground">+50 BTOK</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="h-4 w-4 rounded" />
                      <span>Add music</span>
                    </label>
                    <div className="text-xs text-muted-foreground">+20 BTOK</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="h-4 w-4 rounded" />
                      <span>HD Quality</span>
                    </label>
                    <div className="text-xs text-muted-foreground">+30 BTOK</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="h-4 w-4 rounded" />
                      <span>Add watermark</span>
                    </label>
                    <div className="text-xs text-muted-foreground">Free</div>
                  </div>
                </div>

                <div className="mt-6 p-3 rounded-lg bg-accent/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Total Cost:</span>
                    <span className="font-bold">100 BTOK</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Coins className="h-4 w-4 text-amber-500" />
                    <span>You have 15,800 BTOK available</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Video Info Card */}
            {generatedVideoUrl && (
              <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-900">
                <CardContent className="p-4">
                  <h3 className="font-bold mb-4">Generated Video Info</h3>
                  
                  <div className="rounded-lg overflow-hidden mb-4 aspect-video">
                    <img 
                      src={generatedThumbnailUrl || ''} 
                      alt="Generated video thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-green-600">Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolution:</span>
                      <span>720p</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>15 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span>MP4</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="primary" size="sm" className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>Publish to Feed</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Help Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  <span>Tips for Great Results</span>
                </h3>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <BookText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>Be detailed in your descriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>Specify mood, lighting, and camera angles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Code className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>Include specific art styles if desired</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>Use reference images for better results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Share2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>Share with community for feedback</span>
                  </li>
                </ul>
                
                <Button variant="ghost" size="sm" className="mt-4 w-full">
                  <BookText className="mr-2 h-4 w-4" />
                  <span>View Generation Guide</span>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Generations */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold mb-4">Your Recent Generations</h3>
                
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center py-6">
                    You haven&apos;t generated any videos yet.
                    <br />
                    Start creating to see your history here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 