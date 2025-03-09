"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { VideoFeed } from "@/components/video/VideoFeed";
import { Button } from "@/components/ui/button";
import { videos, categories } from "@/lib/mock-data";
import { Search, Sliders } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DiscoverPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const router = useRouter();
  const { category, q } = searchParams;

  // Filter videos by category if specified
  let filteredVideos = videos;
  let activeCategory = "";

  if (category) {
    filteredVideos = videos.filter((video) =>
      video.categories.includes(category)
    );
    activeCategory = category;
  }

  // Search functionality (mock implementation)
  if (q) {
    const searchTerm = q.toLowerCase();
    filteredVideos = filteredVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(searchTerm) ||
        (video.description &&
          video.description.toLowerCase().includes(searchTerm)) ||
        video.creator.displayName.toLowerCase().includes(searchTerm) ||
        video.categories.some((cat) => cat.toLowerCase().includes(searchTerm))
    );
  }

  const clearFilters = () => {
    router.push('/discover');
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover</h1>
          <p className="text-muted-foreground">
            Explore AI-generated content across different categories
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <form>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search for videos, creators, or categories..."
              className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="hidden"
              name="category"
              value={activeCategory}
            />
          </form>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2">
            <a
              href="/discover"
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !activeCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent/50 hover:bg-accent"
              }`}
            >
              All
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/discover?category=${cat.name}`}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent/50 hover:bg-accent"
                }`}
              >
                <span>{cat.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Filter Button (for mobile) */}
        <div className="flex justify-end mb-4 md:hidden">
          <Button variant="outline" size="sm">
            <Sliders className="mr-2 h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        {/* Results */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {activeCategory ? `${activeCategory} Videos` : "All Videos"}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredVideos.length} videos
            </span>
          </div>

          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredVideos.map((video) => (
                <div key={video.id}>
                  <VideoFeed
                    videos={[video]}
                    viewType="grid"
                    limit={1}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-accent p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-bold">No videos found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you&apos;re looking for
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 