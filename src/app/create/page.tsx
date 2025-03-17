'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentForm } from '@/components/features/content/ContentForm';
import { WalletConnect } from '@/components/features/wallet/WalletConnect';
import { NFTMintStatus } from '@/components/features/nft/NFTMintStatus';
import { ContentGenerator } from '@/lib/ai/contentGenerator';

export default function CreatePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [nftTransactionHash, setNftTransactionHash] = useState<string | null>(null);
  const contentGenerator = new ContentGenerator();

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
    isNFT: boolean;
  }) => {
    try {
      setIsGenerating(true);
      setNftTransactionHash(null);
      const result = await contentGenerator.generateFullContent(formData, walletAddress);
      
      if (formData.isNFT && result.nftMintResponse) {
        setNftTransactionHash(result.nftMintResponse.transactionHash);
      }

      // Handle other content generation results
      console.log('Content generated:', result);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error generating content:', error);
      // Show error message to user
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