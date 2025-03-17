'use client';

import { ContentForm } from '@/components/ContentForm';

export default function UploadPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Upload Content</h1>
        <p className="text-gray-600 mb-8">
          Create new content on the BlockTok platform. Your content will be stored on the blockchain
          and you can mint it as an NFT.
        </p>
        
        <ContentForm />
      </div>
    </div>
  );
} 