'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBlockchain } from '@/components/BlockchainProvider';
import { useEffect } from 'react';
import { loadPhantomScript } from '@/lib/scripts/load-phantom';

export default function CombinedHomePage() {
  const { isConnected, connectWallet } = useBlockchain();
  
  // Preload Phantom script
  useEffect(() => {
    loadPhantomScript().catch(console.error);
  }, []);
  
  return (
    <div className="container mx-auto py-16 px-4">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">BlockTok</h1>
        <p className="text-xl text-gray-600 mb-10">
          AI-powered video creation with blockchain-based ownership and monetization
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/create">
            <Button size="lg" variant="default">
              Generate AI Video
            </Button>
          </Link>
          
          {!isConnected ? (
            <Button size="lg" variant="outline" onClick={connectWallet}>
              Connect Wallet
            </Button>
          ) : (
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">AI Video Generation</h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">AI-Powered Scripting</h3>
                <p className="text-gray-600">Generate engaging scripts based on trending topics using GPT-4.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Voice Synthesis</h3>
                <p className="text-gray-600">Convert text to realistic AI-generated speech using ElevenLabs.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Video Creation</h3>
                <p className="text-gray-600">Create stunning visuals with RunwayML generative AI.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Auto Subtitles</h3>
                <p className="text-gray-600">Automatically generate captions from speech with Whisper AI.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Link href="/create">
              <Button size="lg">
                Generate Video
              </Button>
            </Link>
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold mb-6">Blockchain Integration</h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Content Registration</h3>
                <p className="text-gray-600">Register your content on the Solana blockchain for proof of creation.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">NFT Minting</h3>
                <p className="text-gray-600">Mint your content as NFTs to establish ownership and monetize your work.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">On-Chain Analytics</h3>
                <p className="text-gray-600">Track engagement metrics like views, likes, shares, and comments on-chain.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Creator Monetization</h3>
                <p className="text-gray-600">Earn royalties from your content directly through smart contracts.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            {!isConnected ? (
              <Button size="lg" onClick={connectWallet}>
                Connect Wallet
              </Button>
            ) : (
              <Link href="/upload">
                <Button size="lg">
                  Upload Content
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Use Cases Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Use Cases</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎥</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Crypto & Trading Updates</h3>
            <p className="text-gray-600">Generate daily crypto market updates, token price predictions, and DeFi news in engaging video formats.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎵</span>
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Generated Music & Memes</h3>
            <p className="text-gray-600">Create meme-worthy content, remixing crypto news with auto-generated music and animations.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Educational Shorts</h3>
            <p className="text-gray-600">Explain complex blockchain, DeFi, and AI topics in bite-sized, easy-to-digest videos.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold mb-2">NFT & Project Promotions</h3>
            <p className="text-gray-600">Auto-generate promotional content with influencers, music, and effects for your projects.</p>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="mt-20 bg-gray-50 p-10 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
        <div className="max-w-3xl mx-auto">
          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-lg">Generate Video with AI</h3>
                <p className="text-gray-600">Use our AI tools to create engaging short-form videos optimized for social media.</p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg">Connect Your Wallet</h3>
                <p className="text-gray-600">Link your Solana wallet to register and manage your content on the blockchain.</p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg">Upload to Blockchain</h3>
                <p className="text-gray-600">Register your content on Solana for proof of creation and ownership.</p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-lg">Mint as NFT</h3>
                <p className="text-gray-600">Turn your content into an NFT to enable monetization and royalty payments.</p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                5
              </div>
              <div>
                <h3 className="font-bold text-lg">Track & Monetize</h3>
                <p className="text-gray-600">Monitor engagement metrics and earn royalties through smart contracts.</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/create">
            <Button size="lg" variant="default">
              Generate AI Video
            </Button>
          </Link>
          
          {!isConnected ? (
            <Button size="lg" variant="outline" onClick={connectWallet}>
              Connect Wallet
            </Button>
          ) : (
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 