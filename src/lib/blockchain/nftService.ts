import { InjectiveClient } from '@injectivelabs/sdk-ts';
import { NFTMetadata } from '@/lib/ai/contentGenerator';

interface NFTMintResponse {
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
}

export class NFTService {
  private client: InjectiveClient;
  private contractAddress: string;

  constructor() {
    this.contractAddress = process.env.NFT_CONTRACT_ADDRESS || '';
    if (!this.contractAddress) {
      throw new Error('NFT_CONTRACT_ADDRESS is not set');
    }

    // Initialize Injective client
    this.client = new InjectiveClient({
      network: process.env.INJECTIVE_NETWORK || 'testnet',
      privateKey: process.env.INJECTIVE_PRIVATE_KEY || '',
    });
  }

  async mintNFT(metadata: NFTMetadata): Promise<NFTMintResponse> {
    try {
      // Upload metadata to IPFS
      const metadataUrl = await this.uploadToIPFS(metadata);

      // Prepare mint transaction
      const tx = await this.client.nft.mint({
        contractAddress: this.contractAddress,
        metadata: {
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          attributes: metadata.attributes,
        },
        metadataUrl,
      });

      // Execute transaction
      const response = await tx.execute();

      return {
        tokenId: response.tokenId,
        contractAddress: this.contractAddress,
        transactionHash: response.txHash,
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
      const response = await this.client.nft.getMetadata({
        contractAddress: this.contractAddress,
        tokenId,
      });

      return {
        name: response.name,
        description: response.description,
        image: response.image,
        attributes: response.attributes,
      };
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      throw new Error('Failed to fetch NFT metadata');
    }
  }

  async transferNFT(tokenId: string, toAddress: string): Promise<string> {
    try {
      const tx = await this.client.nft.transfer({
        contractAddress: this.contractAddress,
        tokenId,
        to: toAddress,
      });

      const response = await tx.execute();
      return response.txHash;
    } catch (error) {
      console.error('Error transferring NFT:', error);
      throw new Error('Failed to transfer NFT');
    }
  }
} 