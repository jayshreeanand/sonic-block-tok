'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentForm } from '@/components/features/content/ContentForm';
import { WalletConnect } from '@/components/features/wallet/WalletConnect';
import { NFTMintStatus } from '@/components/features/nft/NFTMintStatus';

export default function CreatePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [nftTransactionHash, setNftTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
  };

  const handleSubmit = async (formData: {
    topic: string;
    tone: string;
    duration: number;
    isNFT?: boolean;
  }) => {
    try {
      setIsGenerating(true);
      setError(null);
      setNftTransactionHash(null);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          walletAddress: formData.isNFT ? walletAddress : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const result = await response.json();
      
      if (formData.isNFT && result.nftMintResponse) {
        setNftTransactionHash(result.nftMintResponse.transactionHash);
      }

      // Handle other content generation results
      console.log('Content generated:', result);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error generating content:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while generating content');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Content</h1>
      
      <div className="mb-8">
        <WalletConnect
          onConnect={handleWalletConnect}
          onDisconnect={handleWalletDisconnect}
        />
      </div>

      <ContentForm
        onSubmit={handleSubmit}
        isGenerating={isGenerating}
        walletAddress={walletAddress}
      />

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {nftTransactionHash && (
        <NFTMintStatus
          transactionHash={nftTransactionHash}
          onComplete={() => {
            // Handle NFT minting completion
            console.log('NFT minting completed');
          }}
        />
      )}
    </div>
  );
} 