import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface NFTMintStatusProps {
  transactionHash: string;
  onComplete?: () => void;
}

export function NFTMintStatus({ transactionHash, onComplete }: NFTMintStatusProps) {
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkTransactionStatus = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SONIC_RPC_URL);
        const receipt = await provider.getTransactionReceipt(transactionHash);

        if (receipt) {
          if (receipt.status === 1) {
            setStatus('completed');
            onComplete?.();
          } else {
            setStatus('failed');
            setError('Transaction failed');
          }
        } else {
          // Transaction is still pending
          setTimeout(checkTransactionStatus, 5000); // Check again in 5 seconds
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
        setStatus('failed');
        setError('Failed to check transaction status');
      }
    };

    checkTransactionStatus();
  }, [transactionHash, onComplete]);

  return (
    <div className="mt-4 p-4 rounded-lg bg-white shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-2">NFT Minting Status</h3>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            status === 'pending' ? 'bg-yellow-400 animate-pulse' :
            status === 'completed' ? 'bg-green-500' :
            'bg-red-500'
          }`} />
          <span className="text-sm font-medium">
            {status === 'pending' ? 'Transaction Pending' :
             status === 'completed' ? 'Transaction Completed' :
             'Transaction Failed'}
          </span>
        </div>

        <div className="text-sm text-gray-500 break-all">
          Transaction Hash: {transactionHash}
        </div>

        {error && (
          <div className="text-sm text-red-600">
            Error: {error}
          </div>
        )}

        {status === 'completed' && (
          <div className="mt-2 text-sm text-green-600">
            Your NFT has been successfully minted!
          </div>
        )}
      </div>
    </div>
  );
} 