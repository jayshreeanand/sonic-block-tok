import { NextRequest, NextResponse } from 'next/server';
import { updateJobStatus } from '@/lib/textToVideoApiFixed';

export async function POST(req: NextRequest) {
  try {
    // Parse the webhook payload
    const payload = await req.json();
    
    console.log('Received webhook from Vadoo:', payload);
    
    // Extract relevant fields
    const { vid, video_url, thumbnail_url, status } = payload;
    
    if (!vid) {
      return NextResponse.json(
        { error: 'Missing video ID in webhook payload' },
        { status: 400 }
      );
    }
    
    // Update the job status using the async function
    const videoId = vid.toString();
    const result = await updateJobStatus(videoId, status, video_url, thumbnail_url);
    
    if (result.success) {
      console.log(result.message);
    } else {
      console.log(`Received webhook for unknown job ID: ${videoId}`);
    }
    
    // Respond to the webhook
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Vadoo webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Optional GET handler for testing the webhook endpoint
export async function GET() {
  return NextResponse.json({ status: 'Vadoo webhook endpoint is active' });
} 