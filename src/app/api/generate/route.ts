import { NextResponse } from 'next/server';
import { ContentGenerator } from '@/lib/ai/contentGenerator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, tone, duration, isNFT, walletAddress } = body;

    const contentGenerator = new ContentGenerator();
    const result = await contentGenerator.generateFullContent(
      { topic, tone, duration, isNFT },
      walletAddress
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 