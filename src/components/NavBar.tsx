'use client';

import React from 'react';
import Link from 'next/link';
import { useBlockchain } from './BlockchainProvider';
import { Button } from './ui/button';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function NavBar() {
  const { isConnected } = useBlockchain();
  
  return (
    <nav className="border-b py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div>
          <Link href="/" className="text-2xl font-bold">
            BlockTok
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          
          {isConnected && (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              
              <Link href="/upload">
                <Button variant="ghost">Upload</Button>
              </Link>
            </>
          )}
          
          <WalletMultiButton className="!bg-primary hover:!bg-primary/90 text-white px-4 py-2 rounded-md" />
        </div>
      </div>
    </nav>
  );
} 