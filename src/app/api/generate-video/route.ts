import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { findBestMatchingVideo } from '@/lib/textToVideoApiFixed';

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
    
    // Find the best matching video from our sample videos
    const matchedVideo = findBestMatchingVideo(prompt);
    console.log("Matched video:", matchedVideo.title);
    
    // For hackathon demo, we'll always use the matched video
    // In production, you would call the Vadoo API here
    const VADOO_API_KEY = process.env.NEXT_PUBLIC_VADOO_API_KEY;
    
    try {
      if (VADOO_API_KEY && false) { // Disabled API call for the hackathon demo
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
          videoUrl: matchedVideo.videoUrl,
          thumbnailUrl: matchedVideo.thumbnailUrl,
          title: matchedVideo.title
        });
      }
    } catch (apiError: unknown) {
      console.error("Vadoo API error:", apiError);
      
      // Log error details if available
      if (apiError && typeof apiError === 'object') {
        const error = apiError as Record<string, unknown>;
        console.error("Error details:", JSON.stringify(error, null, 2));
      }
    }
    
    // Always use the matched video for the hackathon
    return NextResponse.json({
      success: true,
      vid: `sample-${Date.now()}`,
      videoUrl: matchedVideo.videoUrl,
      thumbnailUrl: matchedVideo.thumbnailUrl,
      title: matchedVideo.title
    });
  } catch (error) {
    console.error("Error in video generation API:", error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
} 