import { ethers } from 'ethers';
import { NFTMetadata } from '@/lib/ai/contentGenerator';

interface NFTMintResponse {
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
}

export class SonicService {
  private provider: ethers.Provider;
  private signer: ethers.Signer;
  private contractAddress: string;
  private contract: ethers.Contract;

  constructor() {
    this.contractAddress = process.env.SONIC_NFT_CONTRACT_ADDRESS || '';
    if (!this.contractAddress) {
      throw new Error('SONIC_NFT_CONTRACT_ADDRESS is not set');
    }

    // Initialize provider and signer
    const rpcUrl = process.env.SONIC_RPC_URL || 'https://rpc.sonic.game';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(process.env.SONIC_PRIVATE_KEY || '', this.provider);
    
    // Initialize contract
    const abi = [
      'function mint(address to, string memory tokenURI) public returns (uint256)',
      'function tokenURI(uint256 tokenId) public view returns (string memory)',
      'function ownerOf(uint256 tokenId) public view returns (address)',
      'function transferFrom(address from, address to, uint256 tokenId) public',
    ];
    
    this.contract = new ethers.Contract(
      this.contractAddress,
      abi,
      this.signer
    );
  }

  async mintNFT(metadata: NFTMetadata, toAddress: string): Promise<NFTMintResponse> {
    try {
      // Upload metadata to IPFS
      const metadataUrl = await this.uploadToIPFS(metadata);

      // Mint NFT
      const tx = await this.contract.mint(toAddress, metadataUrl);
      const receipt = await tx.wait();

      // Get token ID from event
      const tokenId = receipt.logs[0].topics[3];

      return {
        tokenId: tokenId.toString(),
        contractAddress: this.contractAddress,
        transactionHash: receipt.hash,
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw new Error('Failed to mint NFT');
    }
  }

  private async uploadToIPFS(metadata: NFTMetadata): Promise<string> {
    try {
      // TODO: Implement IPFS upload
      // This is a placeholder that will be replaced with actual IPFS upload
      return `https://ipfs.io/ipfs/${Buffer.from(JSON.stringify(metadata)).toString('base64')}`;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload metadata to IPFS');
    }
  }

  async getNFTMetadata(tokenId: string): Promise<NFTMetadata> {
    try {
      const tokenURI = await this.contract.tokenURI(tokenId);
      const response = await fetch(tokenURI);
      const metadata = await response.json();

      return {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        attributes: metadata.attributes,
      };
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      throw new Error('Failed to fetch NFT metadata');
    }
  }

  async transferNFT(tokenId: string, toAddress: string): Promise<string> {
    try {
      const owner = await this.contract.ownerOf(tokenId);
      const tx = await this.contract.transferFrom(owner, toAddress, tokenId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error transferring NFT:', error);
      throw new Error('Failed to transfer NFT');
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to get balance');
    }
  }
} 