'use client';

import React, { useState } from 'react';
import { useBlockchain } from './BlockchainProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ContentForm() {
  const { client, isConnected, connectWallet } = useBlockchain();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    contentId: '',
    title: '',
    description: '',
    contentUrl: '',
    contentType: 'video',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !client) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Generate a unique content ID if not provided
      const contentId = formData.contentId || `content-${Date.now()}`;
      
      // Initialize content on the blockchain
      const tx = await client.initializeContent(contentId, {
        title: formData.title,
        description: formData.description,
        contentUrl: formData.contentUrl,
        contentType: formData.contentType,
      });
      
      toast.success('Content initialized on blockchain!');
      console.log('Transaction signature:', tx);
      
      // Reset form
      setFormData({
        contentId: '',
        title: '',
        description: '',
        contentUrl: '',
        contentType: 'video',
      });
      
      // Redirect to content page
      router.push(`/content/${contentId}`);
    } catch (error) {
      console.error('Error initializing content:', error);
      toast.error('Failed to initialize content on blockchain');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Content</CardTitle>
        <CardDescription>Add your content to the BlockTok platform</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contentUrl">Content URL</Label>
            <Input
              id="contentUrl"
              name="contentUrl"
              value={formData.contentUrl}
              onChange={handleInputChange}
              placeholder="Enter content URL"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <select
              id="contentType"
              name="contentType"
              value={formData.contentType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="text">Text</option>
            </select>
          </div>
        </form>
      </CardContent>
      
      <CardFooter>
        {!isConnected ? (
          <Button onClick={connectWallet} className="w-full">
            Connect Wallet
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Content'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 