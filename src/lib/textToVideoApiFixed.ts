// Sample videos as fallbacks in case API calls fail
export const sampleVideos = [
  {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-white-lines-moving-above-a-blue-background-9581-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-white-lines-moving-above-a-blue-background-9581-large.jpg",
    title: "Digital Dreamscape",
    keywords: ["abstract", "lines", "blue", "technology", "digital", "data", "flow"]
  },
  {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-multicolored-light-effects-form-geometric-figures-871-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-multicolored-light-effects-form-geometric-figures-871-large.jpg",
    title: "Geometric Illuminations",
    keywords: ["geometric", "colors", "light", "shapes", "design", "art", "visual"]
  },
  {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-67-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-67-large.jpg",
    title: "Liquid Neural Network",
    keywords: ["water", "fluid", "ink", "liquid", "flow", "colors", "organic"]
  },
  {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-background-with-soft-colors-32770-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-background-with-soft-colors-32770-large.jpg",
    title: "Pastel Algorithms",
    keywords: ["pastel", "soft", "colors", "gradient", "gentle", "calm", "background"]
  },
  {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-great-white-shark-32060-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-great-white-shark-32060-large.jpg",
    title: "Crypto Predator",
    keywords: ["shark", "animal", "ocean", "underwater", "nature", "predator", "3d"]
  },
  {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-nebula-in-outer-space-1610-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-nebula-in-outer-space-1610-large.jpg", 
    title: "Blockchain Cosmos",
    keywords: ["space", "nebula", "stars", "universe", "galaxy", "cosmos", "astronomy"]
  },
  {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-green-natural-light-effect-875-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-green-natural-light-effect-875-large.jpg",
    title: "Token Genesis",
    keywords: ["green", "light", "nature", "glow", "energy", "eco", "environment"]
  },
  {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-view-of-a-blue-wave-4470-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-view-of-a-blue-wave-4470-large.jpg",
    title: "Data Waves",
    keywords: ["wave", "ocean", "water", "blue", "sea", "surf", "beach"]
  },
  {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-a-dj-touching-buttons-on-a-dj-mixer-machine-20282-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-a-dj-touching-buttons-on-a-dj-mixer-machine-20282-large.jpg",
    title: "Blockchain Mix",
    keywords: ["music", "dj", "technology", "buttons", "mixer", "electronic", "audio"]
  },
  {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-99786-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-99786-large.jpg",
    title: "Future Interfaces",
    keywords: ["future", "tech", "device", "interface", "futuristic", "gadget", "innovation"]
  },
  {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.jpg",
    title: "Growth Token",
    keywords: ["tree", "flower", "nature", "plant", "growth", "yellow", "bloom"]
  },
  {
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-particle-sphere-rotating-on-black-background-42349-large.mp4",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-particle-sphere-rotating-on-black-background-42349-large.jpg",
    title: "Network Nodes",
    keywords: ["sphere", "particle", "network", "globe", "rotation", "digital", "world"]
  }
];

// Cache for storing video generation job IDs and their results
// This is now private to this file, not exported directly
const videoGenerationJobs = new Map();

// Map to track video statuses
export interface VideoGenerationStatus {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
}

// Helper function to simulate API processing time
export function simulateProcessing() {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
}

// Functions for webhook handling
export async function updateJobStatus(videoId: string, status: string, videoUrl?: string, thumbnailUrl?: string) {
  if (videoGenerationJobs.has(videoId)) {
    const existingJob = videoGenerationJobs.get(videoId);
    
    videoGenerationJobs.set(videoId, {
      ...existingJob,
      status: status === 'completed' ? 'completed' : 'failed',
      progress: status === 'completed' ? 100 : 0,
      videoUrl: videoUrl || existingJob.videoUrl,
      thumbnailUrl: thumbnailUrl || existingJob.thumbnailUrl,
      updatedAt: new Date().toISOString(),
    });
    
    return { success: true, message: `Updated job ${videoId} status to ${status}` };
  }
  
  return { success: false, message: `Job ${videoId} not found` };
}

// Function to find the best matching video based on prompt keywords
export function findBestMatchingVideo(prompt: string): typeof sampleVideos[0] {
  // Convert prompt to lowercase for case-insensitive matching
  const promptLower = prompt.toLowerCase();
  
  // Create array of words from prompt
  const promptWords = promptLower.split(/\s+/).filter(word => 
    // Filter out common words and short words
    word.length > 3 && 
    !['the', 'and', 'with', 'from', 'that', 'this', 'have', 'for'].includes(word)
  );
  
  // Track match scores for each video
  let bestMatchScore = 0;
  let bestMatchIndex = 0;
  
  // Find the video with highest keyword match
  sampleVideos.forEach((video, index) => {
    let matchScore = 0;
    
    // For each keyword in the prompt, check if it's in the video's keywords
    promptWords.forEach(word => {
      if (video.title.toLowerCase().includes(word)) {
        matchScore += 3; // Title matches are weighted higher
      }
      
      // Check if any of the video keywords match or are similar to this word
      video.keywords.forEach(keyword => {
        if (keyword.includes(word) || word.includes(keyword)) {
          matchScore += 2;
        } else if (keyword.substring(0, 4) === word.substring(0, 4) && keyword.length > 3) {
          // Partial match on word beginnings
          matchScore += 1;
        }
      });
    });
    
    // Update best match if this one is better
    if (matchScore > bestMatchScore) {
      bestMatchScore = matchScore;
      bestMatchIndex = index;
    }
  });
  
  // Default to a random video if no good matches
  if (bestMatchScore === 0) {
    bestMatchIndex = Math.floor(Math.random() * sampleVideos.length);
  }
  
  return sampleVideos[bestMatchIndex];
} 