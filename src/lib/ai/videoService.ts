import axios from 'axios';

interface VideoGenerationOptions {
  style?: string;
  duration?: number;
  resolution?: string;
  fps?: number;
}

interface VideoResponse {
  video_url: string;
  metadata: {
    duration: number;
    resolution: string;
    fps: number;
  };
}

export class VideoService {
  private apiKey: string;
  private baseUrl: string = 'https://api.runwayml.com/v1';

  constructor() {
    this.apiKey = process.env.RUNWAY_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('RUNWAY_API_KEY is not set');
    }
  }

  async generateVideo(
    script: string,
    voiceUrl: string,
    options: VideoGenerationOptions = {}
  ): Promise<string> {
    try {
      const defaultOptions: VideoGenerationOptions = {
        style: 'modern',
        duration: 60,
        resolution: '1080x1920', // Vertical format for mobile
        fps: 30,
        ...options,
      };

      // First, generate a video from the script using Runway's Gen-2 model
      const response = await axios.post<VideoResponse>(
        `${this.baseUrl}/inference/gen-2`,
        {
          prompt: script,
          duration: defaultOptions.duration,
          resolution: defaultOptions.resolution,
          fps: defaultOptions.fps,
          style: defaultOptions.style,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Get the generated video URL
      const videoUrl = response.data.video_url;

      // If we have a voice URL, we need to combine it with the video
      if (voiceUrl) {
        // TODO: Implement audio-video combination
        // For now, we'll just return the video URL
        // In a production environment, you would want to use a service like FFmpeg
        // to combine the audio and video
      }

      return videoUrl;
    } catch (error) {
      console.error('Error generating video:', error);
      throw new Error('Failed to generate video');
    }
  }

  async getVideoStatus(videoId: string): Promise<'processing' | 'completed' | 'failed'> {
    try {
      const response = await axios.get(`${this.baseUrl}/inference/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.data.status;
    } catch (error) {
      console.error('Error checking video status:', error);
      throw new Error('Failed to check video status');
    }
  }

  async getAvailableStyles(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/styles`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.data.styles;
    } catch (error) {
      console.error('Error fetching available styles:', error);
      throw new Error('Failed to fetch available styles');
    }
  }
} 