'use client';

import { useEffect, useState } from 'react';
import { useBlockchain } from '@/components/BlockchainProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Plus, Award, ExternalLink } from 'lucide-react';
import { ContentAccountWithPublicKey } from '@/lib/blockchain/BlocktokClient';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const { client, isConnected, connectWallet, publicKey } = useBlockchain();
  
  const [contentList, setContentList] = useState<ContentAccountWithPublicKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user's content when wallet is connected
  useEffect(() => {
    async function fetchUserContent() {
      if (!client || !isConnected || !publicKey) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const contents = await client.getAllContentByCreator(publicKey);
        setContentList(contents);
      } catch (error) {
        console.error('Error fetching user content:', error);
        toast.error('Failed to load your content');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserContent();
  }, [client, isConnected, publicKey]);
  
  // Renders a preview of the content based on its type
  const renderContentPreview = (content: ContentAccountWithPublicKey) => {
    const { contentType, contentUrl, title } = content.account;
    
    switch (contentType) {
      case 'video':
        return (
          <div className="relative h-32 w-full bg-gray-100 rounded-lg overflow-hidden">
            <video
              className="h-full w-full object-cover"
              src={contentUrl}
              muted
              loop
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <ExternalLink className="h-8 w-8 text-white" />
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="relative h-32 w-full bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={contentUrl}
              alt={title}
              layout="fill"
              objectFit="cover"
            />
          </div>
        );
      case 'audio':
        return (
          <div className="h-32 w-full bg-gray-100 rounded-lg flex items-center justify-center">
            <audio
              className="w-full px-4"
              src={contentUrl}
              controls
            />
          </div>
        );
      default:
        return (
          <div className="h-32 w-full bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-sm text-gray-500">Preview not available</p>
          </div>
        );
    }
  };
  
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet to View Dashboard</h2>
        <p className="text-gray-600 mb-6">Connect your Solana wallet to view your content and analytics</p>
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading your content...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Content</h1>
          <p className="text-gray-600">Manage your BlockTok content and NFTs</p>
        </div>
        
        <Link href="/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Content
          </Button>
        </Link>
      </div>
      
      {contentList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No Content Found</h3>
          <p className="text-gray-600 mb-6">You haven&apos;t created any content yet. Start by creating your first content.</p>
          <Link href="/upload">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Content
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentList.map((content) => (
            <Card key={content.account.contentId} className="overflow-hidden">
              {renderContentPreview(content)}
              
              <CardHeader className="py-4">
                <CardTitle className="text-lg">{content.account.title}</CardTitle>
                <CardDescription className="line-clamp-2">{content.account.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="py-2">
                <div className="flex justify-between text-sm">
                  <span>
                    <span className="font-medium">Views:</span>{' '}
                    {content.account.analytics.views.toString()}
                  </span>
                  <span>
                    <span className="font-medium">Likes:</span>{' '}
                    {content.account.analytics.likes.toString()}
                  </span>
                  <span>
                    <span className="font-medium">Comments:</span>{' '}
                    {content.account.analytics.comments.toString()}
                  </span>
                </div>
              </CardContent>
              
              <CardFooter className="border-t py-3 flex justify-between">
                <Link href={`/content/${content.account.contentId}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                
                {content.account.nftMint ? (
                  <div className="flex items-center text-green-600">
                    <Award className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">NFT Minted</span>
                  </div>
                ) : (
                  <Link href={`/content/${content.account.contentId}`}>
                    <Button size="sm">Mint NFT</Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 