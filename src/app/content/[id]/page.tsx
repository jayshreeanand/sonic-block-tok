'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useBlockchain } from '@/components/BlockchainProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Heart, Share2, MessageSquare, Award } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
import { ContentAccount } from '@/lib/blockchain/BlocktokClient';
import Image from 'next/image';

export default function ContentDetailPage() {
  const params = useParams();
  const contentId = params?.id as string;
  const { client, isConnected, connectWallet, publicKey } = useBlockchain();
  
  const [content, setContent] = useState<ContentAccount | null>(null);
  const [creator, setCreator] = useState<PublicKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [isUpdatingAnalytics, setIsUpdatingAnalytics] = useState(false);
  
  // Fetch content data
  useEffect(() => {
    async function fetchContent() {
      if (!client || !isConnected || !publicKey) return;
      
      try {
        setIsLoading(true);
        
        // Try to fetch content created by current user
        try {
          const contentData = await client.getContent(publicKey, contentId);
          setContent(contentData);
          setCreator(publicKey);
          setIsLoading(false);
          return;
        } catch {
          console.log('Content not found for current user, searching...');
        }
        
        // If not found, we need to search for the content by creator
        // This is a simplified approach - in a real app, you would have a backend
        // that maintains a database of content IDs and their creators
        // For now, we'll just show an error
        toast.error('Content not found. Please make sure you have the correct content ID.');
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching content:', err);
        toast.error('Failed to load content');
        setIsLoading(false);
      }
    }
    
    fetchContent();
  }, [client, isConnected, publicKey, contentId]);
  
  // Function to mint an NFT
  const handleMintNFT = async () => {
    if (!client || !isConnected || !content || !creator) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (content.nftMint) {
      toast.error('NFT has already been minted for this content');
      return;
    }
    
    try {
      setIsMinting(true);
      
      // Prepare NFT metadata
      const nftMetadata = {
        name: content.title,
        symbol: 'BTOK',
        uri: `https://blocktok.app/metadata/${contentId}`, // This would be replaced with actual metadata URI
        royaltyBasisPoints: 500, // 5%
      };
      
      // Mint the NFT
      const tx = await client.mintNft(
        creator,
        contentId,
        nftMetadata
      );
      
      toast.success('NFT minted successfully!');
      console.log('Transaction signature:', tx);
      
      // Refresh content data to see NFT mint
      const updatedContent = await client.getContent(creator, contentId);
      setContent(updatedContent);
    } catch (err) {
      console.error('Error minting NFT:', err);
      toast.error('Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };
  
  // Function to update analytics (like, share, view, comment)
  const handleUpdateAnalytics = async (type: 'views' | 'likes' | 'shares' | 'comments') => {
    if (!client || !isConnected || !content || !creator) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      setIsUpdatingAnalytics(true);
      
      // Create a copy of the current analytics
      const analytics = {
        views: content.analytics.views.toNumber(),
        likes: content.analytics.likes.toNumber(),
        shares: content.analytics.shares.toNumber(),
        comments: content.analytics.comments.toNumber(),
        updatedAt: Date.now(),
      };
      
      // Increment the specified analytics type
      analytics[type] += 1;
      
      // Update the analytics on the blockchain
      const tx = await client.updateAnalytics(
        creator,
        contentId,
        analytics
      );
      
      toast.success(`Content ${type} updated!`);
      console.log('Transaction signature:', tx);
      
      // Refresh content data to see updated analytics
      const updatedContent = await client.getContent(creator, contentId);
      setContent(updatedContent);
    } catch (err) {
      console.error('Error updating analytics:', err);
      toast.error('Failed to update analytics');
    } finally {
      setIsUpdatingAnalytics(false);
    }
  };
  
  // Helper function to render the content
  const renderContent = () => {
    if (!content) return null;
    
    switch (content.contentType) {
      case 'video':
        return (
          <div className="relative h-96 w-full">
            <video
              className="h-full w-full object-cover rounded-lg"
              src={content.contentUrl}
              controls
              onPlay={() => handleUpdateAnalytics('views')}
            />
          </div>
        );
      case 'image':
        return (
          <div className="relative h-96 w-full">
            <Image
              src={content.contentUrl}
              alt={content.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
              onClick={() => handleUpdateAnalytics('views')}
            />
          </div>
        );
      case 'audio':
        return (
          <div className="w-full">
            <audio
              className="w-full"
              src={content.contentUrl}
              controls
              onPlay={() => handleUpdateAnalytics('views')}
            />
          </div>
        );
      default:
        return (
          <div className="p-4 border rounded-lg bg-gray-50">
            <p>{content.contentUrl}</p>
          </div>
        );
    }
  };
  
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet to View Content</h2>
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading content...</p>
      </div>
    );
  }
  
  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Content Not Found</h2>
        <p>The content you are looking for does not exist or you don&apos;t have permission to view it.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{content.title}</CardTitle>
          <CardDescription>
            <span className="font-medium">Creator: </span>
            {creator?.toString().slice(0, 4)}...{creator?.toString().slice(-4)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Content Preview */}
          {renderContent()}
          
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{content.description}</p>
          </div>
          
          {/* Analytics */}
          <div className="flex space-x-4 pt-4 border-t">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleUpdateAnalytics('likes')}
                disabled={isUpdatingAnalytics}
              >
                <Heart className="h-5 w-5 mr-1" />
                {content.analytics.likes.toString()}
              </Button>
            </div>
            
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleUpdateAnalytics('comments')}
                disabled={isUpdatingAnalytics}
              >
                <MessageSquare className="h-5 w-5 mr-1" />
                {content.analytics.comments.toString()}
              </Button>
            </div>
            
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleUpdateAnalytics('shares')}
                disabled={isUpdatingAnalytics}
              >
                <Share2 className="h-5 w-5 mr-1" />
                {content.analytics.shares.toString()}
              </Button>
            </div>
            
            <div className="flex items-center ml-auto">
              <span className="text-sm text-gray-500">
                <span className="font-medium">Views: </span>
                {content.analytics.views.toString()}
              </span>
            </div>
          </div>
          
          {/* NFT Status */}
          {content.nftMint ? (
            <div className="bg-green-50 p-4 rounded-lg flex items-center">
              <Award className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="font-semibold">NFT Minted</p>
                <p className="text-sm text-gray-600">
                  Mint Address: {content.nftMint.toString().slice(0, 6)}...{content.nftMint.toString().slice(-6)}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold">No NFT minted yet</p>
              <p className="text-sm text-gray-600">You can mint an NFT for this content to enable royalty payments and ownership transfer.</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          {!content.nftMint && (
            <Button 
              onClick={handleMintNFT} 
              disabled={isMinting} 
              className="w-full"
            >
              {isMinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting NFT...
                </>
              ) : (
                <>
                  <Award className="mr-2 h-4 w-4" />
                  Mint NFT
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 