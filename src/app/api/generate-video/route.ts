import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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
    
    const VADOO_API_KEY = process.env.NEXT_PUBLIC_VADOO_API_KEY;
    
    if (!VADOO_API_KEY) {
      return NextResponse.json(
        { error: 'Vadoo API key is not configured' },
        { status: 500 }
      );
    }
    
    // Create request body and headers
    const requestBody = {
      topic: "Custom",
      prompt: prompt,
      custom_instruction: "Create a high-quality, engaging short video with smooth transitions and professional visuals."
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
    
    // Call Vadoo API
    const response = await axios.post(
      "https://viralapi.vadoo.tv/api/generate_video",
      requestBody,
      { headers }
    );
    
    console.log("Vadoo API Response:", {
      status: response.status,
      data: response.data
    });
    
    if (!response.data.vid) {
      throw new Error('No video ID received from Vadoo API');
    }
    
    // Poll for video URL
    let attempts = 0;
    const maxAttempts = 36; // 3 minutes total (5 seconds * 36 attempts)
    let videoUrl = null;
    
    while (!videoUrl && attempts < maxAttempts) {
      try {
        const urlResponse = await axios.get(
          `https://viralapi.vadoo.tv/api/get_video_url?id=${response.data.vid}`,
          { headers }
        );
        
        console.log("URL check response:", urlResponse.data);
        
        if (urlResponse.data.status === 'completed' && urlResponse.data.url) {
          videoUrl = urlResponse.data.url;
          break;
        } else if (urlResponse.data.status === 'failed') {
          throw new Error('Video generation failed');
        }
        
        attempts++;
        // Wait for 5 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error("URL check error:", error);
        // If it's a 404, the video might still be processing
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }
        throw error;
      }
    }
    
    if (attempts >= maxAttempts) {
      throw new Error('Video generation timed out after 3 minutes');
    }
    
    return NextResponse.json({
      success: true,
      vid: response.data.vid,
      videoUrl,
      thumbnailUrl: videoUrl?.replace('.mp4', '.jpg'), // Generate thumbnail URL from video URL
      title: prompt
    });
    
  } catch (error) {
    console.error("Error in video generation API:", error);
    
    // Log error details if available
    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;
      console.error("Error details:", JSON.stringify(errorObj, null, 2));
    }
    
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
} 