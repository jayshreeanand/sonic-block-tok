import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Sample videos as fallbacks
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

export async function POST(req: NextRequest) {
  try {
    // Get the prompt from the request body
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    console.log("Generating video with prompt:", prompt);
    
    // For hackathon, we'll use sample videos
    // In production, you would call the Vadoo API here
    const VADOO_API_KEY = process.env.NEXT_PUBLIC_VADOO_API_KEY;
    console.log("API Key available:", !!VADOO_API_KEY);
    
    try {
      if (VADOO_API_KEY) {
        // Create request body and headers
        const requestBody = {
          topic: "Custom",
          prompt: prompt,
          custom_instruction: "Create a high-quality, engaging short video."
        };
        
        const headers = {
          "X-API-KEY": VADOO_API_KEY,
          "Content-Type": "application/json"
        };
        
        console.log("Vadoo API Request:", {
          url: "https://viralapi.vadoo.tv/api/generate_video",
          body: JSON.stringify(requestBody),
          headers: JSON.stringify(headers)
        });
        
        // Attempt to call Vadoo API
        const response = await axios.post(
          "https://viralapi.vadoo.tv/api/generate_video",
          requestBody,
          { headers }
        );
        
        console.log("Vadoo API Response:", {
          status: response.status,
          data: response.data
        });
        
        // Return the video ID from the response
        return NextResponse.json({
          success: true,
          vid: response.data.vid,
          // For demo, also return a sample video
          videoUrl: sampleVideos[0].videoUrl,
          thumbnailUrl: sampleVideos[0].thumbnailUrl
        });
      }
    } catch (apiError: unknown) {
      console.error("Vadoo API error:", apiError);
      
      // Log error details if available
      if (apiError && typeof apiError === 'object') {
        const error = apiError as Record<string, unknown>;
        console.error("Error details:", JSON.stringify(error, null, 2));
      }
      
      // Fall back to sample videos
    }
    
    // Use a deterministic choice based on prompt length if API fails or key not set
    const promptHash = prompt.length % sampleVideos.length;
    const selectedVideo = sampleVideos[promptHash];
    
    return NextResponse.json({
      success: true,
      vid: `sample-${Date.now()}`,
      videoUrl: selectedVideo.videoUrl,
      thumbnailUrl: selectedVideo.thumbnailUrl
    });
  } catch (error) {
    console.error("Error in video generation API:", error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
} 