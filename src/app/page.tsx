'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBlockchain } from '@/components/BlockchainProvider';

export default function HomePage() {
  const { isConnected, connectWallet } = useBlockchain();
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to BlockTok</h1>
        <p className="text-xl text-gray-600 mb-10">
          A decentralized content platform where creators own their content through NFTs
          and earn royalties directly from viewers and supporters.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {!isConnected ? (
            <Button size="lg" onClick={connectWallet}>
              Connect Wallet
            </Button>
          ) : (
            <>
              <Link href="/dashboard">
                <Button size="lg">
                  View Dashboard
                </Button>
              </Link>
              
              <Link href="/upload">
                <Button size="lg" variant="outline">
                  Upload Content
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="bg-primary/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Upload Content</h3>
          <p className="text-gray-600">
            Share your videos, images, or other content on the Solana blockchain.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="bg-primary/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Mint NFTs</h3>
          <p className="text-gray-600">
            Turn your content into NFTs to establish ownership and earn royalties.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="bg-primary/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Earn Royalties</h3>
          <p className="text-gray-600">
            Set royalty percentages and receive payments directly to your wallet.
          </p>
        </div>
      </div>
      
      <div className="mt-20 bg-gray-50 p-10 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
        <div className="max-w-3xl mx-auto">
          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-lg">Connect Your Wallet</h3>
                <p className="text-gray-600">Link your Solana wallet to start using BlockTok.</p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg">Create Content</h3>
                <p className="text-gray-600">Upload your content and store it securely on the blockchain.</p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg">Mint as NFT</h3>
                <p className="text-gray-600">Transform your content into an NFT to establish ownership.</p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <h3 className="font-bold text-lg">Set Royalty Distribution</h3>
                <p className="text-gray-600">Define how royalties will be distributed among collaborators.</p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                5
              </div>
              <div>
                <h3 className="font-bold text-lg">Earn Rewards</h3>
                <p className="text-gray-600">Receive payments directly to your wallet as people interact with your content.</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
