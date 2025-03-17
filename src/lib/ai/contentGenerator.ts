import OpenAI from 'openai';
import { ContentFormData } from '@/components/features/content/CreateContentForm';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedContent {
  script: string;
  voiceUrl?: string;
  videoUrl?: string;
  nftMetadata?: NFTMetadata;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export class ContentGenerator {
  private static instance: ContentGenerator;

  private constructor() {}

  public static getInstance(): ContentGenerator {
    if (!ContentGenerator.instance) {
      ContentGenerator.instance = new ContentGenerator();
    }
    return ContentGenerator.instance;
  }

  async generateScript(formData: ContentFormData): Promise<string> {
    const prompt = this.createScriptPrompt(formData);
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert content creator specializing in creating engaging short-form video scripts."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating script:', error);
      throw new Error('Failed to generate script');
    }
  }

  private createScriptPrompt(formData: ContentFormData): string {
    return `Create an engaging short-form video script for the following content:

Title: ${formData.title}
Topic: ${formData.topic}
Style: ${formData.style}
Description: ${formData.description}

The script should be:
- Optimized for ${formData.platforms.join(', ')}
- Engaging and attention-grabbing
- Include clear sections for visuals and voice-over
- Follow best practices for short-form video content
- Include hooks and calls to action

Please format the script with clear sections for:
1. Hook (first 3 seconds)
2. Main content
3. Call to action

Make it natural and conversational, suitable for voice-over.`;
  }

  async generateVoiceOver(script: string): Promise<string> {
    // TODO: Implement ElevenLabs integration
    // This is a placeholder that will be replaced with actual ElevenLabs API call
    return `https://api.elevenlabs.io/v1/text-to-speech/${script}`;
  }

  async generateVideo(script: string, voiceUrl: string): Promise<string> {
    // TODO: Implement Pika Labs integration
    // This is a placeholder that will be replaced with actual Pika Labs API call
    // Using voiceUrl in the API endpoint to indicate that the video should include the generated voice
    return `https://api.pikalabs.io/v1/video/${script}?voice=${voiceUrl}`;
  }

  async generateNFTMetadata(content: GeneratedContent, formData: ContentFormData): Promise<NFTMetadata> {
    // TODO: Implement NFT metadata generation
    // This is a placeholder that will be replaced with actual NFT metadata generation
    return {
      name: formData.title,
      description: formData.description,
      image: content.videoUrl || '',
      attributes: [
        {
          trait_type: 'Style',
          value: formData.style
        },
        {
          trait_type: 'Platforms',
          value: formData.platforms.join(', ')
        }
      ]
    };
  }

  async generateFullContent(formData: ContentFormData): Promise<GeneratedContent> {
    try {
      const script = await this.generateScript(formData);
      const voiceUrl = await this.generateVoiceOver(script);
      const videoUrl = await this.generateVideo(script, voiceUrl);

      const content: GeneratedContent = {
        script,
        voiceUrl,
        videoUrl,
      };

      if (formData.isNFT) {
        content.nftMetadata = await this.generateNFTMetadata(content, formData);
      }

      return content;
    } catch (error) {
      console.error('Error generating full content:', error);
      throw error;
    }
  }
} 