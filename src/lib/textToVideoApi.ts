"use server";

import axios from "axios";

// Your Vadoo API key - store this in environment variables in production
const VADOO_API_KEY = process.env.NEXT_PUBLIC_VADOO_API_KEY || "your-api-key-here";

// Sample videos as fallbacks in case API calls fail
const sampleVideos = [
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

// Generate a video using Vadoo AI API
export async function generateVideoFromText(prompt: string) {
  try {
    console.log("Generating video with prompt:", prompt);
    
    // For hackathon demo, use deterministic video selection if API key isn't set
    if (!VADOO_API_KEY || VADOO_API_KEY === "your-api-key-here") {
      await simulateProcessing();
      const promptHash = prompt.length % sampleVideos.length;
      return sampleVideos[promptHash];
    }
    
    // Real API call to Vadoo
    const response = await axios.post(
      "https://viralapi.vadoo.tv/api/generate_video",
      {
        prompt: prompt,
        custom_instruction: "Create a high-quality, engaging short video that's perfect for sharing on social media."
      },
      {
        headers: {
          "X-API-KEY": VADOO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    
    // Get video ID from response
    const videoId = response.data.vid.toString();
    console.log("Generated video ID:", videoId);
    
    // Store job information
    videoGenerationJobs.set(videoId, {
      id: videoId,
      status: 'pending',
      progress: 10,
      createdAt: new Date().toISOString(),
      prompt
    });
    
    // In a real implementation, you would wait for webhook callback with the video URL
    // For now, we'll simulate this by polling the status
    const result = await pollVideoStatus(videoId);
    
    return {
      videoUrl: result.videoUrl || sampleVideos[0].videoUrl,
      thumbnailUrl: result.thumbnailUrl || sampleVideos[0].thumbnailUrl,
    };
  } catch (error) {
    console.error("Error generating video with Vadoo API:", error);
    
    // Use fallback for demo purposes
    const promptHash = prompt.length % sampleVideos.length;
    return sampleVideos[promptHash];
  }
}

// Function to poll video generation status
async function pollVideoStatus(videoId: string): Promise<VideoGenerationStatus> {
  // In a real implementation, this would check an actual status endpoint
  // For demo purposes, we'll simulate completion
  return new Promise((resolve) => {
    setTimeout(() => {
      // Set job status to completed after 3 seconds
      videoGenerationJobs.set(videoId, {
        ...videoGenerationJobs.get(videoId),
        status: 'completed',
        progress: 100,
        videoUrl: sampleVideos[0].videoUrl,
        thumbnailUrl: sampleVideos[0].thumbnailUrl,
      });
      
      resolve({
        id: videoId,
        status: 'completed',
        progress: 100,
        videoUrl: sampleVideos[0].videoUrl,
        thumbnailUrl: sampleVideos[0].thumbnailUrl,
      });
    }, 3000);
  });
}

// Function to get video generation status
export async function getVideoGenerationStatus(id: string): Promise<VideoGenerationStatus> {
  // Check if job exists in our tracking map
  if (videoGenerationJobs.has(id)) {
    return videoGenerationJobs.get(id);
  }
  
  // If not found, return default status
  return {
    id,
    status: 'failed',
    progress: 0,
    errorMessage: 'Video generation job not found'
  };
}

// Helper function to simulate API processing time
function simulateProcessing() {
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

/*
 * In production, you would implement a webhook endpoint to receive video completion updates from Vadoo.
 * Example webhook handler:
 *
 * export async function handleVadooWebhook(req, res) {
 *   const { vid, video_url, thumbnail_url, status } = req.body;
 *   
 *   if (status === 'completed' && videoGenerationJobs.has(vid.toString())) {
 *     videoGenerationJobs.set(vid.toString(), {
 *       ...videoGenerationJobs.get(vid.toString()),
 *       status: 'completed',
 *       progress: 100,
 *       videoUrl: video_url,
 *       thumbnailUrl: thumbnail_url,
 *     });
 *   }
 *   
 *   res.status(200).json({ success: true });
 * }
 */ 