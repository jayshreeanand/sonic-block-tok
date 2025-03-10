import { MainLayout } from "@/components/layout/MainLayout";
import { videos, categories } from "@/lib/mock-data";
import { DiscoverClient } from "./DiscoverClient";
import { Metadata } from "next";

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: "Discover - BlockTok",
  description: "Explore AI-generated content across different categories",
};

export default async function DiscoverPage({ searchParams }: PageProps) {
  const category = searchParams.category as string | undefined;
  const q = searchParams.q as string | undefined;

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

  return (
    <MainLayout>
      <DiscoverClient 
        filteredVideos={filteredVideos}
        activeCategory={activeCategory}
        categories={categories}
        searchQuery={q}
      />
    </MainLayout>
  );
} 