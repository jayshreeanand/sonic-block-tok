import * as anchor from '@coral-xyz/anchor';
import { Program, BN, AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, Keypair, Connection, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { IDL } from './blocktok-idl';

export interface ContentData {
  title: string;
  description: string;
  contentUrl: string;
  contentType: string;
}

export interface ContentAnalytics {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  updatedAt: number;
}

export interface RoyaltyRecipient {
  address: string;
  percentage: number;
}

export interface NftMetadata {
  name: string;
  symbol: string;
  uri: string;
  royaltyBasisPoints: number;
}

// Define interfaces for the content object
export interface ContentAccount {
  creator: PublicKey;
  contentId: string;
  title: string;
  description: string;
  contentUrl: string;
  contentType: string;
  createdAt: BN;
  nftMint: PublicKey | null;
  analytics: {
    views: BN;
    likes: BN;
    shares: BN;
    comments: BN;
    updatedAt: BN;
  };
  royaltyRecipients: Array<{
    pubkey: PublicKey;
    percentage: number;
  }>;
  bump: number;
}

export interface ContentAccountWithPublicKey {
  publicKey: PublicKey;
  account: ContentAccount;
}

export class BlocktokClient {
  private program: Program;
  private connection: Connection;
  private provider: AnchorProvider;
  
  /**
   * Create a new BlocktokClient
   * @param connection Solana connection
   * @param wallet Wallet for signing transactions
   * @param programId The deployed program ID
   */
  constructor(
    connection: Connection,
    wallet: anchor.Wallet,
    programId: string = '3jf8o4DHcTUg71tpP7PdRFGyBrfFKW2H6LBstCfs5vqz'
  ) {
    this.connection = connection;
    
    // Create anchor provider
    this.provider = new AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    );
    
    // Initialize program
    this.program = new Program(IDL, new PublicKey(programId), this.provider);
  }
  
  /**
   * Derives the content PDA address
   */
  async getContentPDA(creator: PublicKey, contentId: string): Promise<PublicKey> {
    const [contentPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('content'),
        creator.toBuffer(),
        Buffer.from(contentId),
      ],
      this.program.programId
    );
    
    return contentPda;
  }
  
  /**
   * Initialize content
   */
  async initializeContent(
    contentId: string,
    contentData: ContentData
  ): Promise<string> {
    const creator = this.provider.wallet.publicKey;
    const contentPda = await this.getContentPDA(creator, contentId);
    
    try {
      const tx = await this.program.methods
        .initializeContent(
          contentId,
          contentData.title,
          contentData.description,
          contentData.contentUrl,
          contentData.contentType
        )
        .accounts({
          creator,
          content: contentPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      console.log('Content initialized with transaction:', tx);
      return tx;
    } catch (error) {
      console.error('Error initializing content:', error);
      throw error;
    }
  }
  
  /**
   * Get content data
   */
  async getContent(creator: PublicKey, contentId: string): Promise<ContentAccount> {
    const contentPda = await this.getContentPDA(creator, contentId);
    
    try {
      const content = await this.program.account.content.fetch(contentPda);
      return content as ContentAccount;
    } catch (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
  }
  
  /**
   * Update content analytics
   */
  async updateAnalytics(
    creator: PublicKey,
    contentId: string,
    analytics: ContentAnalytics
  ): Promise<string> {
    const contentPda = await this.getContentPDA(creator, contentId);
    
    try {
      const tx = await this.program.methods
        .updateAnalytics(
          new BN(analytics.views),
          new BN(analytics.likes),
          new BN(analytics.shares),
          new BN(analytics.comments)
        )
        .accounts({
          authority: this.provider.wallet.publicKey,
          content: contentPda,
        })
        .rpc();
      
      console.log('Analytics updated with transaction:', tx);
      return tx;
    } catch (error) {
      console.error('Error updating analytics:', error);
      throw error;
    }
  }
  
  /**
   * Mint NFT for content
   */
  async mintNft(
    creator: PublicKey,
    contentId: string,
    nftMetadata: NftMetadata
  ): Promise<string> {
    const contentPda = await this.getContentPDA(creator, contentId);
    
    // Create new keypair for the mint
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    
    // Get associated token account address
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      this.provider.wallet.publicKey
    );
    
    // Derive metadata and master edition PDAs
    const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    
    const [metadataPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer()
      ],
      METADATA_PROGRAM_ID
    );
    
    const [masterEditionPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition')
      ],
      METADATA_PROGRAM_ID
    );
    
    try {
      const tx = await this.program.methods
        .mintNft(
          nftMetadata.name,
          nftMetadata.symbol,
          nftMetadata.uri,
          nftMetadata.royaltyBasisPoints
        )
        .accounts({
          creator: this.provider.wallet.publicKey,
          content: contentPda,
          mint,
          tokenAccount,
          metadata: metadataPda,
          masterEdition: masterEditionPda,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([mintKeypair])
        .rpc();
      
      console.log('NFT minted with transaction:', tx);
      return tx;
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }
  
  /**
   * Set royalty distribution
   */
  async setRoyaltyDistribution(
    creator: PublicKey,
    contentId: string,
    recipients: RoyaltyRecipient[]
  ): Promise<string> {
    const contentPda = await this.getContentPDA(creator, contentId);
    
    // Convert percentage to basis points and create arrays
    const percentages = recipients.map(r => r.percentage * 100); // Convert to basis points
    const recipientAccounts = recipients.map(r => new PublicKey(r.address));
    
    try {
      const tx = await this.program.methods
        .setRoyaltyDistribution(percentages)
        .accounts({
          creator: this.provider.wallet.publicKey,
          content: contentPda,
        })
        .remainingAccounts(
          recipientAccounts.map(pubkey => ({
            pubkey,
            isWritable: false,
            isSigner: false,
          }))
        )
        .rpc();
      
      console.log('Royalty distribution set with transaction:', tx);
      return tx;
    } catch (error) {
      console.error('Error setting royalty distribution:', error);
      throw error;
    }
  }
  
  /**
   * Get all content by creator
   */
  async getAllContentByCreator(creator: PublicKey): Promise<ContentAccountWithPublicKey[]> {
    try {
      // Filter for the content account
      const accounts = await this.program.account.content.all([
        {
          memcmp: {
            offset: 8, // After the account discriminator
            bytes: creator.toBase58(),
          }
        }
      ]);
      
      return accounts as ContentAccountWithPublicKey[];
    } catch (error) {
      console.error('Error fetching creator content:', error);
      throw error;
    }
  }
} 