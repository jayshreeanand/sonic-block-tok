'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { 
  Connection, 
  PublicKey, 
  Transaction 
} from '@solana/web3.js';
import { loadPhantomScript } from '@/lib/scripts/load-phantom';

// Define the shape of our blockchain context
interface BlockchainContextType {
  isConnected: boolean;
  publicKey: PublicKey | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signAndSendTransaction: (transaction: Transaction) => Promise<string>;
}

// Create the context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  isConnected: false,
  publicKey: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  signAndSendTransaction: async () => '',
});

// Custom hook to use the blockchain context
export const useBlockchain = () => useContext(BlockchainContext);

// Provider component
export function BlockchainProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  
  // Load Phantom script and check for wallet on component mount
  useEffect(() => {
    const initPhantom = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Load the Phantom script if it's not already loaded
        await loadPhantomScript();
        
        // Check for existing connection
        const checkForPhantom = async () => {
          // @ts-expect-error - Phantom is injected into the window object
          const phantom = window.phantom?.solana;
          
          if (phantom) {
            try {
              // Check if the wallet was previously connected
              const response = await phantom.connect({ onlyIfTrusted: true });
              setPublicKey(new PublicKey(response.publicKey.toString()));
              setIsConnected(true);
            } catch (error) {
              // User hasn't connected to the app yet or connection failed
              console.log("Wallet not connected or error:", error);
            }
          }
        };
        
        await checkForPhantom();
      } catch (error) {
        console.error("Error initializing Phantom:", error);
      }
    };
    
    initPhantom();
  }, []);
  
  // Connect to Phantom wallet
  const connectWallet = async () => {
    try {
      // Ensure script is loaded
      await loadPhantomScript();

      // @ts-expect-error - Phantom is injected into the window object
      const phantom = window.phantom?.solana;
      
      if (phantom) {
        const response = await phantom.connect();
        setPublicKey(new PublicKey(response.publicKey.toString()));
        setIsConnected(true);
        return;
      }
      
      // If Phantom wallet isn't installed, direct user to install it
      window.open('https://phantom.app/', '_blank');
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };
  
  // Disconnect from wallet
  const disconnectWallet = () => {
    try {
      // @ts-expect-error - Phantom is injected into the window object
      window.phantom?.solana?.disconnect();
      setPublicKey(null);
      setIsConnected(false);
    } catch (error) {
      console.error("Error disconnecting from wallet:", error);
    }
  };
  
  // Sign and send a transaction
  const signAndSendTransaction = async (transaction: Transaction): Promise<string> => {
    try {
      // Ensure script is loaded
      await loadPhantomScript();

      // @ts-expect-error - Phantom is injected into the window object
      const phantom = window.phantom?.solana;
      
      if (!phantom || !isConnected) {
        throw new Error("Wallet not connected");
      }
      
      // Connect to Solana devnet for testing
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      
      // Have Phantom sign the transaction
      const { signature } = await phantom.signAndSendTransaction(transaction);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature);
      
      return signature;
    } catch (error) {
      console.error("Error signing transaction:", error);
      throw error;
    }
  };
  
  // Provide the blockchain context to child components
  return (
    <BlockchainContext.Provider
      value={{
        isConnected,
        publicKey,
        connectWallet,
        disconnectWallet,
        signAndSendTransaction,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
} 