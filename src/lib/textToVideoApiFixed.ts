// Sample videos as fallbacks in case API calls fail
export const sampleVideos = [
  {
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
  },
  {
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
  },
  {
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
  },
  {
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
  },
  {
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
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