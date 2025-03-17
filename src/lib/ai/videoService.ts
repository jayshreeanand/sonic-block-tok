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
  private baseUrl: string = 'https://api.pikalabs.io/v1';

  constructor() {
    this.apiKey = process.env.PIKA_LABS_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('PIKA_LABS_API_KEY is not set');
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

      const response = await axios.post<VideoResponse>(
        `${this.baseUrl}/videos/generate`,
        {
          script,
          voice_url: voiceUrl,
          ...defaultOptions,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.video_url;
    } catch (error) {
      console.error('Error generating video:', error);
      throw new Error('Failed to generate video');
    }
  }

  async getVideoStatus(videoId: string): Promise<'processing' | 'completed' | 'failed'> {
    try {
      const response = await axios.get(`${this.baseUrl}/videos/${videoId}`, {
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