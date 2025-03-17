'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CreateContentForm from '@/components/features/content/CreateContentForm';
import { ContentFormData } from '@/components/features/content/CreateContentForm';
import { GeneratedContent } from '@/lib/ai/contentGenerator';

export default function CreatePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ContentFormData) => {
    try {
      setIsGenerating(true);
      setError(null);
      setGeneratedContent(null);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const content = await response.json();
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating content:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Content</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill out the form below to generate your AI-powered video content.
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <CreateContentForm onSubmit={handleSubmit} />
          </div>
        </div>

        {isGenerating && (
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-gray-600">Generating content...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {generatedContent && (
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Generated Content
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Script</h4>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                    {generatedContent.script}
                  </p>
                </div>
                {generatedContent.voiceUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Voice Over</h4>
                    <audio controls className="mt-1 w-full">
                      <source src={generatedContent.voiceUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                {generatedContent.videoUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Video</h4>
                    <video controls className="mt-1 w-full">
                      <source src={generatedContent.videoUrl} type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                  </div>
                )}
                {generatedContent.nftMetadata && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">NFT Metadata</h4>
                    <pre className="mt-1 text-sm text-gray-600 overflow-auto">
                      {JSON.stringify(generatedContent.nftMetadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              How it works
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>1. Enter your content details and select target platforms</p>
              <p>2. Our AI will generate a script based on your topic</p>
              <p>3. The script will be converted to natural-sounding speech</p>
              <p>4. AI will create engaging visuals to match your content</p>
              <p>5. Your content will be automatically published to selected platforms</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 