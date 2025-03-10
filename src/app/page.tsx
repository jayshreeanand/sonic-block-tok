"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { VideoFeed } from "@/components/video/VideoFeed";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Button } from "@/components/ui/button";
import { videos, categories } from "@/lib/mock-data";
import { Coins, TrendingUp, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@/components/wallet/ConnectButton";

export default function HomePage() {
  const router = useRouter();
  
  // Get a featured video for the hero section
  const featuredVideo = videos.find(v => v.id === "3") || videos[0]; // Digital Fashion video
  
  // Filter videos by categories - make sure each section has different videos
  const animationVideos = videos.filter(v => 
    v.title.includes("Animation") || 
    v.title.includes("Neural") || 
    (v.description && v.description.includes("animation"))
  ).slice(0, 6);
  
  const aiArtVideos = videos.filter(v => 
    v.categories.includes("AI Art") && 
    !animationVideos.some(av => av.id === v.id)
  ).slice(0, 6);
  
  const techVideos = videos.filter(v => 
    v.categories.includes("Tech") && 
    !aiArtVideos.some(av => av.id === v.id) &&
    !animationVideos.some(av => av.id === v.id)
  ).slice(0, 6);
  
  const trendingVideos = [...videos]
    .sort((a, b) => b.views - a.views)
    .filter(v => 
      !aiArtVideos.some(av => av.id === v.id) &&
      !techVideos.some(tv => tv.id === v.id) &&
      !animationVideos.some(av => av.id === v.id)
    ).slice(0, 6);
    
  const nftVideos = videos
    .filter(v => v.isNFT)
    .filter(v => 
      !aiArtVideos.some(av => av.id === v.id) &&
      !techVideos.some(tv => tv.id === v.id) &&
      !animationVideos.some(av => av.id === v.id) &&
      !trendingVideos.some(tv => tv.id === v.id)
    ).slice(0, 6);

  const navigateToCreate = () => {
    router.push('/create');
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 pb-8">
        {/* Hero Section */}
        <section className="relative">
          <div className="container mx-auto py-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-10">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  <span className="block">AI-Generated</span>
                  <span className="bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
                    Animated Videos
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Create stunning animations from text, earn tokens, and join the future of digital content.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" variant="primary" onClick={navigateToCreate}>
                    <Sparkles className="mr-2 h-5 w-5" />
                    <span>Generate Video</span>
                  </Button>
                  <Button size="lg" variant="outline">
                    <Coins className="mr-2 h-5 w-5" />
                    <span>How to Earn</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>Powered by Injective blockchain</span>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <VideoPlayer video={featuredVideo} />
              </div>
            </div>

            {/* New Feature Highlight */}
            <div className="mt-8 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-purple-500/20 p-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold">New: Text-to-Video AI Generation</h2>
              </div>
              <p className="mb-4">
                Create stunning short videos from just a text description! Our AI will generate high-quality
                animations based on your prompt. Perfect for content creators, marketers, and anyone who wants to
                create engaging visual content without specialized equipment or skills.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg bg-background p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-full bg-green-100 p-1">
                      <span className="text-green-600 font-bold">1</span>
                    </div>
                    <h3 className="font-medium">Enter your prompt</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Describe the animation you want to create with as much detail as possible.
                  </p>
                </div>
                <div className="rounded-lg bg-background p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-full bg-green-100 p-1">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <h3 className="font-medium">AI generates your video</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our advanced AI models create a unique animated video based on your description.
                  </p>
                </div>
                <div className="rounded-lg bg-background p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-full bg-green-100 p-1">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <h3 className="font-medium">Use, share or mint as NFT</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Download your animation, share it on the platform, or mint it as an NFT to earn tokens.
                  </p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button variant="primary" size="lg" onClick={navigateToCreate}>
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Explore Categories</h2>
            <Link href="/discover" className="text-primary">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8">
            {categories.map((category) => (
              <Link 
                href={`/discover?category=${category.name}`} 
                key={category.id}
                className="flex flex-col items-center justify-center rounded-lg bg-accent/50 p-4 text-center transition-colors hover:bg-accent"
              >
                <div className="mb-2 rounded-full bg-background p-2">
                  <span className="text-xl">{category.icon === 'music' ? '🎵' : category.icon === 'cpu' ? '💻' : category.icon === 'bitcoin' ? '₿' : '🎨'}</span>
                </div>
                <span className="font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Videos */}
        <section className="container mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <VideoFeed videos={trendingVideos} />
        </section>

        {/* Animation Videos */}
        <section className="container mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            <h2 className="text-2xl font-bold">AI Animations</h2>
          </div>
          <VideoFeed videos={animationVideos} />
        </section>

        {/* AI Art Videos */}
        <section className="container mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <h2 className="text-2xl font-bold">AI Art Creations</h2>
          </div>
          <VideoFeed videos={aiArtVideos} />
        </section>

        {/* Tech Videos */}
        <section className="container mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Tech & Innovation</h2>
          </div>
          <VideoFeed videos={techVideos} />
        </section>

        {/* NFT Videos */}
        <section className="container mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-gradient-to-r from-purple-500 to-blue-600 p-1">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Exclusive NFTs</h2>
          </div>
          <VideoFeed videos={nftVideos} />
        </section>

        {/* CTA Section */}
        <section className="container mx-auto bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-8 text-white">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Start Earning Today</h2>
              <p className="mb-6">
                Connect your wallet and start earning INJ tokens for watching videos, creating content, and participating in the BlockTok ecosystem.
              </p>
              <ConnectButton variant="default" size="lg" className="bg-white text-purple-600 hover:bg-gray-100" />
            </div>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md">
                <h3 className="text-xl font-bold mb-4">How It Works</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-white/20 p-1 mt-1">
                      <span className="text-sm">1</span>
                    </div>
                    <span>Connect your Injective wallet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-white/20 p-1 mt-1">
                      <span className="text-sm">2</span>
                    </div>
                    <span>Watch AI-generated videos to earn INJ tokens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-white/20 p-1 mt-1">
                      <span className="text-sm">3</span>
                    </div>
                    <span>Create and mint your own AI-generated videos as NFTs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-white/20 p-1 mt-1">
                      <span className="text-sm">4</span>
                    </div>
                    <span>Participate in campaigns and earn additional rewards</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
