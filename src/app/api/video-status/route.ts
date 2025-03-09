import { NextRequest, NextResponse } from 'next/server';

// A simple in-memory cache to track job status for demo purposes
// In production, you would use a database or Redis
const videoJobs = new Map();

export async function GET(req: NextRequest) {
  try {
    // Get job ID from URL parameters
    const jobId = req.nextUrl.searchParams.get('jobId');
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    // Get job status from our mock cache
    if (videoJobs.has(jobId)) {
      return NextResponse.json(videoJobs.get(jobId));
    }
    
    // For demo purposes, simulate status for any job ID
    // In production, you would check the actual status from Vadoo or your DB
    const randomProgress = Math.floor(Math.random() * 100);
    const mockStatus = {
      id: jobId,
      status: randomProgress >= 90 ? 'completed' : 'pending',
      progress: randomProgress,
      createdAt: new Date().toISOString()
    };
    
    // Store in our mock cache
    videoJobs.set(jobId, mockStatus);
    
    return NextResponse.json(mockStatus);
  } catch (error) {
    console.error("Error checking video status:", error);
    return NextResponse.json(
      { error: 'Failed to check video status' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Update job status
    const body = await req.json();
    const { jobId, status, progress, videoUrl, thumbnailUrl } = body;
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    // Update our mock cache
    videoJobs.set(jobId, {
      id: jobId,
      status: status || 'pending',
      progress: progress || 0,
      videoUrl,
      thumbnailUrl,
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating video status:", error);
    return NextResponse.json(
      { error: 'Failed to update video status' },
      { status: 500 }
    );
  }
} 