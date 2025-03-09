import { MainLayout } from "@/components/layout/MainLayout";
import { VideoFeed } from "@/components/video/VideoFeed";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Button } from "@/components/ui/button";
import { videos, categories } from "@/lib/mock-data";
import { Coins, TrendingUp, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  // Get a featured video for the hero section
  const featuredVideo = videos[0];
  
  // Filter videos by categories
  const aiArtVideos = videos.filter(v => v.categories.includes("AI Art"));
  const techVideos = videos.filter(v => v.categories.includes("Tech"));
  const trendingVideos = [...videos].sort((a, b) => b.views - a.views).slice(0, 10);
  const nftVideos = videos.filter(v => v.isNFT);

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
                    Short Videos
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Earn tokens for watching, sharing, and interacting with AI-generated content.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" variant="primary">
                    <Sparkles className="mr-2 h-5 w-5" />
                    <span>Discover Content</span>
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

        {/* AI Art Videos */}
        <section className="container mx-auto">
          <VideoFeed title="AI Art Creations" videos={aiArtVideos} />
        </section>

        {/* Tech Videos */}
        <section className="container mx-auto">
          <VideoFeed title="Tech & Innovation" videos={techVideos} />
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
                Connect your wallet and start earning tokens for watching videos, creating content, and participating in the BlockTok ecosystem.
              </p>
              <Button size="lg" variant="default" className="bg-white text-purple-600 hover:bg-gray-100">
                Connect Wallet
              </Button>
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
                    <span>Watch AI-generated videos to earn BTOK tokens</span>
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
