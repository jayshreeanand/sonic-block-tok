"use client";

import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/contexts/WalletContext";
import { formatAddress, formatBalance } from "@/lib/wallet";
import { Wallet, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConnectButtonProps {
  variant?: "default" | "outline" | "primary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ConnectButton({ 
  variant = "default", 
  size = "default",
  className = "" 
}: ConnectButtonProps) {
  const { wallet, connectWallet, disconnectWallet, isConnecting } = useWalletContext();
  
  const handleConnect = async () => {
    try {
      const result = await connectWallet();
      if (!result.success) {
        console.error("Failed to connect wallet");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  // If not connected, show connect button
  if (!wallet.connected) {
    return (
      <Button 
        variant={variant} 
        size={size}
        className={className}
        onClick={handleConnect}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  // If connected, show wallet info and dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={size}
          className={`${className} border-green-500/20 text-green-700 hover:border-green-500/30 hover:bg-green-500/10`}
        >
          <Wallet className="mr-2 h-4 w-4 text-green-600" />
          <span className="mr-2">{formatBalance(wallet.balance)} BTOK</span>
          <span className="text-xs text-muted-foreground">{formatAddress(wallet.address)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          // Copy address to clipboard
          if (wallet.address) {
            navigator.clipboard.writeText(wallet.address);
            alert("Wallet address copied to clipboard");
          }
        }}>
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(`https://testnet.explorer.injective.network/account/${wallet.address}`, '_blank')}>
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={handleDisconnect}>
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 