import OpenAI from 'openai';
import { VoiceService } from './voiceService';
import { VideoService } from './videoService';
import { SonicService } from '../blockchain/sonicService';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface GeneratedContent {
  script: string;
  voiceUrl: string;
  videoUrl: string;
  nftMetadata?: NFTMetadata;
  nftMintResponse?: {
    tokenId: string;
    contractAddress: string;
    transactionHash: string;
  };
}

export class ContentGenerator {
  private openai: OpenAI;
  private voiceService: VoiceService;
  private videoService: VideoService;
  private sonicService: SonicService;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.voiceService = new VoiceService();
    this.videoService = new VideoService();
    this.sonicService = new SonicService();
  }

  async generateScript(topic: string, tone: string, duration: number): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a creative content writer. Generate a ${duration}-second script in a ${tone} tone about ${topic}. The script should be engaging and suitable for a short-form video.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating script:', error);
      throw new Error('Failed to generate script');
    }
  }

  async generateFullContent(
    formData: {
      topic: string;
      tone: string;
      duration: number;
      isNFT: boolean;
    },
    walletAddress?: string | null
  ): Promise<GeneratedContent> {
    try {
      // Generate script
      const script = await this.generateScript(
        formData.topic,
        formData.tone,
        formData.duration
      );

      // Generate voice over
      const voiceUrl = await this.voiceService.generateVoice(script);

      // Generate video
      const videoUrl = await this.videoService.generateVideo(script, voiceUrl, {
        duration: formData.duration,
      });

      // Generate NFT metadata if requested
      let nftMetadata: NFTMetadata | undefined;
      let nftMintResponse: GeneratedContent['nftMintResponse'] | undefined;

      if (formData.isNFT && walletAddress) {
        nftMetadata = {
          name: `BlockTok: ${formData.topic}`,
          description: script,
          image: videoUrl,
          attributes: [
            {
              trait_type: 'Topic',
              value: formData.topic,
            },
            {
              trait_type: 'Tone',
              value: formData.tone,
            },
            {
              trait_type: 'Duration',
              value: `${formData.duration}s`,
            },
          ],
        };

        // Mint NFT on Sonic blockchain
        nftMintResponse = await this.sonicService.mintNFT(nftMetadata, walletAddress);
      }

      return {
        script,
        voiceUrl,
        videoUrl,
        nftMetadata,
        nftMintResponse,
      };
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    }
  }
} 