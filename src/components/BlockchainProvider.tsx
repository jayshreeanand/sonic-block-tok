'use client';

import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { BlocktokClient } from '@/lib/blockchain/BlocktokClient';
import { toast } from 'sonner';

// Create a context for the BlocktokClient
interface BlockchainContextType {
  client: BlocktokClient | null;
  connection: Connection | null;
  isConnected: boolean;
  publicKey: PublicKey | null;
  connectWallet: () => void;
}

// Default context values
const defaultContext: BlockchainContextType = {
  client: null,
  connection: null,
  isConnected: false,
  publicKey: null,
  connectWallet: () => {},
};

const BlockchainContext = createContext<BlockchainContextType>(defaultContext);

// Create a hook for accessing the blockchain context
export function useBlockchain() {
  return useContext(BlockchainContext);
}

interface BlockchainProviderProps {
  children: React.ReactNode;
}

export function BlockchainProvider({ children }: BlockchainProviderProps) {
  const wallet = useWallet();
  const { publicKey, connect, connected } = wallet;
  const [client, setClient] = useState<BlocktokClient | null>(null);
  
  // Create a connection to Solana devnet
  const connection = useMemo(() => {
    return new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet'),
      'confirmed'
    );
  }, []);
  
  // Initialize the BlocktokClient when wallet is connected
  useEffect(() => {
    if (connected && publicKey && wallet.wallet) {
      try {
        // Create an anchor wallet adapter from the wallet
        const anchorWallet = {
          publicKey: publicKey,
          signTransaction: wallet.signTransaction,
          signAllTransactions: wallet.signAllTransactions,
        };
        
        // Initialize the client
        const newClient = new BlocktokClient(
          connection,
          anchorWallet,
          process.env.NEXT_PUBLIC_BLOCKTOK_PROGRAM_ID || '3jf8o4DHcTUg71tpP7PdRFGyBrfFKW2H6LBstCfs5vqz'
        );
        
        setClient(newClient);
        toast.success('Connected to BlockTok blockchain client');
      } catch (error) {
        console.error('Error initializing BlocktokClient:', error);
        toast.error('Failed to connect to blockchain');
      }
    } else {
      setClient(null);
    }
  }, [connection, publicKey, connected, wallet]);
  
  // Function to handle connecting to wallet
  const connectWallet = async () => {
    if (wallet.wallet) {
      try {
        await connect();
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast.error('Failed to connect wallet');
      }
    } else {
      toast.error('Please install a Solana wallet extension');
    }
  };
  
  // Context value
  const value = {
    client,
    connection,
    isConnected: connected,
    publicKey,
    connectWallet,
  };
  
  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
} 