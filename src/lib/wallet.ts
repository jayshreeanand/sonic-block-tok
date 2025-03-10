import { useState, useEffect } from 'react';

// Wallet connection state
export type WalletState = {
  connected: boolean;
  address: string | null;
  balance: number;
};

// Mock wallet connection for hackathon
export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
  });

  const connectWallet = async () => {
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful connection
      const mockAddress = "inj1qr8ysyyjahm75ks9f0hk0lvlp3zxhy4tv0t0qj";
      const mockBalance = 2.5; // INJ tokens
      
      setWallet({
        connected: true,
        address: mockAddress,
        balance: mockBalance,
      });
      
      // Save connection state to localStorage for persistence
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', mockAddress);
      localStorage.setItem('walletBalance', mockBalance.toString());
      
      return { success: true, address: mockAddress };
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return { success: false, error };
    }
  };

  const disconnectWallet = () => {
    setWallet({
      connected: false,
      address: null,
      balance: 0,
    });
    
    // Clear saved state
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletBalance');
  };

  // Check for existing connection on mount
  useEffect(() => {
    const connected = localStorage.getItem('walletConnected') === 'true';
    const address = localStorage.getItem('walletAddress');
    const balance = parseFloat(localStorage.getItem('walletBalance') || '0');
    
    if (connected && address) {
      setWallet({
        connected,
        address,
        balance,
      });
    }
  }, []);

  // For a real implementation, you would use the Injective SDK:
  // https://github.com/InjectiveLabs/injective-ts

  return {
    wallet,
    connectWallet,
    disconnectWallet,
  };
}

// Utility function to format wallet address for display
export function formatAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Utility function to format token balance
export function formatBalance(balance: number): string {
  return balance.toFixed(2);
} 