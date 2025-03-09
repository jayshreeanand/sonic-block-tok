"use client";

import { createContext, useContext, ReactNode, useState } from 'react';
import { useWallet, WalletState } from '@/lib/wallet';

// Define the wallet context type
type WalletContextType = {
  wallet: WalletState;
  connectWallet: () => Promise<{ success: boolean; address?: string; error?: unknown }>;
  disconnectWallet: () => void;
  isConnecting: boolean;
};

// Create context with a default value
const WalletContext = createContext<WalletContextType>({
  wallet: { connected: false, address: null, balance: 0 },
  connectWallet: async () => ({ success: false }),
  disconnectWallet: () => {},
  isConnecting: false,
});

// Hook for using the wallet context
export const useWalletContext = () => useContext(WalletContext);

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  // Wrap the connectWallet function to handle loading state
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const result = await connectWallet();
      return result;
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <WalletContext.Provider 
      value={{ 
        wallet, 
        connectWallet: handleConnect, 
        disconnectWallet,
        isConnecting
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// For easier imports
export default WalletContext; 