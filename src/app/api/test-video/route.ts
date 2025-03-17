import { NextResponse } from 'next/server';
import { VideoService } from '@/lib/ai/videoService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  console.log('Test video route hit');
  
  try {
    const videoService = new VideoService();
    
    // Test with a simple prompt
    const testScript = "A beautiful sunset over mountains, cinematic style";
    const testVoiceUrl = "https://example.com/test-voice.mp3"; // Placeholder URL
    
    console.log('Starting video generation test...');
    const videoUrl = await videoService.generateVideo(testScript, testVoiceUrl, {
      duration: 10, // Short duration for testing
      resolution: '1080x1920',
      fps: 30,
    });

    console.log('Video generation successful:', videoUrl);
    return NextResponse.json({ success: true, videoUrl });
  } catch (error) {
    console.error('Error in test video generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate test video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 