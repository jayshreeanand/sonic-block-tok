import RunwayML from '@runwayml/sdk';

// Import SDK parameter types
import type { RunwayML as RunwayMLTypes } from '@runwayml/sdk';

// Define task response type
interface TaskResponse {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  output?: {
    video?: string;
  };
  error?: string;
}

export class VideoService {
  private client: RunwayML;

  constructor() {
    const apiKey = process.env.RUNWAY_API_KEY;
    if (!apiKey) {
      throw new Error('RUNWAY_API_KEY is not set in environment variables');
    }

    // Initialize the RunwayML client with the SDK
    this.client = new RunwayML({
      apiKey,
      maxRetries: 3,
      timeout: 30000, // 30 seconds timeout
    });
  }

  async generateVideo(script: string, voiceUrl: string, options: {
    duration?: number;
    resolution?: string;
    fps?: number;
  } = {}): Promise<string> {
    try {
      const {
        duration = 10,
        resolution = '1280:768',
      } = options;

      // Convert resolution format if needed (replace x with :)
      const ratio = resolution.includes('x') ? resolution.replace('x', ':') : resolution;
      
      // Make sure duration is one of the allowed values (5 or 10)
      const videoDuration = (duration <= 5) ? 5 : 10;
      
      // Make sure ratio is one of the allowed values
      const videoRatio = (ratio === '768:1280' || ratio === '1280:768') ? ratio : '1280:768';

      console.log('Starting video generation with options:', {
        duration: videoDuration,
        ratio: videoRatio
      });

      // Generate video using RunwayML SDK
      console.log('Attempting to create video with RunwayML SDK...');
      
      // Create image-to-video generation task
      const params: RunwayMLTypes.ImageToVideoCreateParams = {
        promptImage: "https://picsum.photos/800/600", // Using a placeholder image
        model: "gen3a_turbo",
        promptText: script,
        watermark: false,
        duration: videoDuration,
        ratio: videoRatio as "1280:768" | "768:1280"
      };
      
      const imageToVideo = await this.client.imageToVideo.create(params);

      console.log('Initial response:', imageToVideo);
      const taskId = imageToVideo.id;

      if (!taskId) {
        throw new Error('No task ID returned from video generation');
      }

      // Poll for video generation status
      let attempts = 0;
      const maxAttempts = 60; // 10 minutes total (10 seconds per attempt)
      
      while (attempts < maxAttempts) {
        try {
          console.log(`Checking task status (attempt ${attempts + 1})...`);
          // Use request method to get task status
          const response = await this.client.request({
            method: 'get',
            path: `/v1/tasks/${taskId}`
          });
          const taskStatus = response as TaskResponse;
          console.log(`Status response:`, taskStatus);
          
          if (taskStatus.status === 'COMPLETED' && taskStatus.output?.video) {
            console.log('Video generation completed successfully');
            return taskStatus.output.video;
          }
          
          if (taskStatus.status === 'FAILED') {
            console.error('Video generation failed:', taskStatus.error);
            throw new Error(taskStatus.error || 'Video generation failed');
          }
          
          // Wait 10 seconds before next attempt - API updates every 5 seconds
          console.log(`Video still processing. Status: ${taskStatus.status}. Waiting 10 seconds before next check...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
          attempts++;
        } catch (error) {
          console.error(`Error checking status (attempt ${attempts + 1}):`, error);
          // Continue polling even if we get an error
          await new Promise(resolve => setTimeout(resolve, 10000));
          attempts++;
        }
      }

      throw new Error('Video generation timed out');
    } catch (error: unknown) {
      console.error('Error generating video:', error);
      if (error instanceof RunwayML.APIError) {
        console.error('RunwayML API error details:', {
          status: error.status,
          name: error.name,
          message: error.message,
        });
      }
      throw new Error('Failed to generate video');
    }
  }

  async cancelTask(taskId: string): Promise<void> {
    try {
      // Use the request method with delete to cancel a task
      await this.client.request({
        method: 'delete',
        path: `/v1/tasks/${taskId}`
      });
      console.log(`Task ${taskId} successfully canceled`);
    } catch (error: unknown) {
      console.error('Error canceling task:', error);
      if (error instanceof RunwayML.APIError && error.status !== 404) { // Ignore 404 errors for idempotency
        console.error('API error details:', {
          status: error.status,
          name: error.name,
          message: error.message,
        });
        throw new Error('Failed to cancel task');
      }
    }
  }

  async getAvailableStyles(): Promise<string[]> {
    try {
      // Return the available models for image-to-video in the current API
      return ["gen3a_turbo"];
    } catch (error: unknown) {
      console.error('Error fetching available styles:', error);
      throw new Error('Failed to fetch available styles');
    }
  }
} 