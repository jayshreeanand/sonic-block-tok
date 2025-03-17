import RunwayML from '@runwayml/sdk';

interface VideoResponse {
  id: string;
  status: 'starting' | 'processing' | 'completed' | 'failed';
  output?: {
    video: string;
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

    // Initialize the RunwayML client
    this.client = new RunwayML({
      apiKey,
      timeout: 30000, // 30 seconds timeout
      maxRetries: 3, // Retry failed requests up to 3 times
    });
  }

  async generateVideo(script: string, voiceUrl: string, options: {
    duration?: number;
    resolution?: string;
    fps?: number;
  } = {}): Promise<string> {
    try {
      const {
        duration = 15,
        resolution = '1080x1920',
        fps = 30,
      } = options;

      console.log('Starting video generation with options:', {
        style: 'modern',
        duration,
        resolution,
        fps,
      });

      // Generate video using Runway's Gen-2 model
      const response = await this.client.post('/inference/gen-2', {
        body: {
          prompt: script,
          duration: duration,
          resolution: resolution,
          fps: fps,
          style: 'modern',
          negative_prompt: 'blurry, low quality, distorted',
          guidance_scale: 7.5,
          num_inference_steps: 50,
        }
      }) as VideoResponse;

      console.log('Initial response:', response);

      // Poll for video generation status
      let attempts = 0;
      const maxAttempts = 30; // 5 minutes total (10 seconds per attempt)
      
      while (attempts < maxAttempts) {
        try {
          const statusResponse = await this.getVideoStatus(response.id);
          
          if (statusResponse.status === 'completed' && statusResponse.output?.video) {
            console.log('Video generation completed successfully');
            return statusResponse.output.video;
          }
          
          if (statusResponse.status === 'failed') {
            console.error('Video generation failed:', statusResponse.error);
            throw new Error(statusResponse.error || 'Video generation failed');
          }
          
          // Wait 10 seconds before next attempt
          await new Promise(resolve => setTimeout(resolve, 10000));
          attempts++;
        } catch (error: unknown) {
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
        console.error('Runway API error details:', {
          status: error.status,
          name: error.name,
          message: error.message,
        });
      }
      throw new Error('Failed to generate video');
    }
  }

  private async getVideoStatus(id: string): Promise<VideoResponse> {
    try {
      const response = await this.client.get(`/inference/gen-2/${id}`) as VideoResponse;
      return response;
    } catch (error: unknown) {
      if (error instanceof RunwayML.APIError) {
        console.error('Status check error:', {
          status: error.status,
          name: error.name,
          message: error.message,
        });
      }
      throw error;
    }
  }

  async getAvailableStyles(): Promise<string[]> {
    try {
      const response = await this.client.get('/models') as { data: Array<{ name: string }> };
      return response.data.map(model => model.name);
    } catch (error: unknown) {
      console.error('Error fetching available styles:', error);
      throw new Error('Failed to fetch available styles');
    }
  }
} 