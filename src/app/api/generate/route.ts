import { NextResponse } from 'next/server';
import { ContentGenerator } from '@/lib/ai/contentGenerator';
import { ContentFormData } from '@/components/features/content/CreateContentForm';

export async function POST(request: Request) {
  try {
    const formData: ContentFormData = await request.json();
    
    // Validate required fields
    if (!formData.title || !formData.topic || !formData.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize content generator
    const contentGenerator = ContentGenerator.getInstance();

    // Generate content
    const content = await contentGenerator.generateFullContent(formData);

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error in content generation API:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 