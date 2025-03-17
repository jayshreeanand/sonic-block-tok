import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { Buffer } from 'buffer';
import * as borsh from 'borsh';

// Define schema for content initialization
class InitializeContentArgs {
  contentId: string;
  title: string;
  description: string;
  contentUrl: string;
  contentType: string;
  createdAt: bigint;

  constructor(args: {
    contentId: string;
    title: string;
    description: string;
    contentUrl: string;
    contentType: string;
    createdAt: number;
  }) {
    this.contentId = args.contentId;
    this.title = args.title;
    this.description = args.description;
    this.contentUrl = args.contentUrl;
    this.contentType = args.contentType;
    this.createdAt = BigInt(args.createdAt);
  }
}

// Define schema for NFT minting
class MintNFTArgs {
  name: string;
  symbol: string;
  uri: string;
  royaltyBasisPoints: number;

  constructor(args: {
    name: string;
    symbol: string;
    uri: string;
    royaltyBasisPoints: number;
  }) {
    this.name = args.name;
    this.symbol = args.symbol;
    this.uri = args.uri;
    this.royaltyBasisPoints = args.royaltyBasisPoints;
  }
}

// Define schema for analytics update
class UpdateAnalyticsArgs {
  views: bigint;
  likes: bigint;
  shares: bigint;
  comments: bigint;
  updatedAt: bigint;

  constructor(args: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    updatedAt: number;
  }) {
    this.views = BigInt(args.views);
    this.likes = BigInt(args.likes);
    this.shares = BigInt(args.shares);
    this.comments = BigInt(args.comments);
    this.updatedAt = BigInt(args.updatedAt);
  }
}

// Define schema for royalty distribution
class SetRoyaltyDistributionArgs {
  royaltyRecipients: [string, number][];

  constructor(args: { royaltyRecipients: [string, number][] }) {
    this.royaltyRecipients = args.royaltyRecipients;
  }
}

// Enum for instruction type
enum InstructionType {
  InitializeContent = 0,
  MintNFT = 1,
  UpdateAnalytics = 2,
  SetRoyaltyDistribution = 3,
}

// Helper function to serialize data (workaround for borsh type issues)
function serializeData(schema: Record<string, any>, data: any): Buffer {
  // Use borsh serialize but handle it as a Buffer for TypeScript compatibility
  const serialized = borsh.serialize(schema as any, data);
  return Buffer.from(serialized);
}

export class SolanaClient {
  private connection: Connection;
  private programId: PublicKey;
  private payer: Keypair;

  constructor(
    connection: Connection,
    programId: string,
    payerPrivateKey: Uint8Array
  ) {
    this.connection = connection;
    this.programId = new PublicKey(programId);
    this.payer = Keypair.fromSecretKey(payerPrivateKey);
  }

  /**
   * Derive PDA for content account
   */
  async deriveContentAddress(
    creator: PublicKey,
    contentId: string
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddress(
      [Buffer.from('content'), creator.toBuffer(), Buffer.from(contentId)],
      this.programId
    );
  }

  /**
   * Initialize content with metadata
   */
  async initializeContent(
    creator: Keypair,
    contentId: string,
    title: string,
    description: string,
    contentUrl: string,
    contentType: string
  ): Promise<string> {
    // Derive PDA for content account
    const [contentPubkey] = await this.deriveContentAddress(
      creator.publicKey,
      contentId
    );
    
    // Create instruction data
    const instructionArgs = new InitializeContentArgs({
      contentId,
      title,
      description,
      contentUrl,
      contentType,
      createdAt: Math.floor(Date.now() / 1000),
    });
    
    // Define schema for serialization
    const schema = {
      kind: 'struct',
      fields: [
        ['contentId', 'string'],
        ['title', 'string'],
        ['description', 'string'],
        ['contentUrl', 'string'],
        ['contentType', 'string'],
        ['createdAt', 'u64'],
      ],
    };
    
    // Serialize instruction data
    const serializedArgs = serializeData({ InitializeContentArgs: schema }, instructionArgs);
    const instructionData = Buffer.alloc(1 + serializedArgs.length);
    
    // Set instruction type
    instructionData.writeUInt8(InstructionType.InitializeContent, 0);
    
    // Write serialized arguments
    serializedArgs.copy(instructionData, 1);

    // Create instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: creator.publicKey, isSigner: true, isWritable: true },
        { pubkey: contentPubkey, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: instructionData,
    });

    // Create and sign transaction
    const transaction = new Transaction().add(instruction);
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.payer, creator]
    );

    return signature;
  }

  /**
   * Update content analytics
   */
  async updateAnalytics(
    authority: Keypair,
    contentId: string,
    views: number,
    likes: number,
    shares: number,
    comments: number
  ): Promise<string> {
    // Derive PDA for content account
    const [contentPubkey] = await this.deriveContentAddress(
      authority.publicKey,
      contentId
    );
    
    // Create instruction data
    const instructionArgs = new UpdateAnalyticsArgs({
      views,
      likes,
      shares,
      comments,
      updatedAt: Math.floor(Date.now() / 1000),
    });
    
    // Define schema for serialization
    const schema = {
      kind: 'struct',
      fields: [
        ['views', 'u64'],
        ['likes', 'u64'],
        ['shares', 'u64'],
        ['comments', 'u64'],
        ['updatedAt', 'u64'],
      ],
    };
    
    // Serialize instruction data
    const serializedArgs = serializeData({ UpdateAnalyticsArgs: schema }, instructionArgs);
    const instructionData = Buffer.alloc(1 + serializedArgs.length);
    
    // Set instruction type
    instructionData.writeUInt8(InstructionType.UpdateAnalytics, 0);
    
    // Write serialized arguments
    serializedArgs.copy(instructionData, 1);

    // Create instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: authority.publicKey, isSigner: true, isWritable: false },
        { pubkey: contentPubkey, isSigner: false, isWritable: true },
      ],
      programId: this.programId,
      data: instructionData,
    });

    // Create and sign transaction
    const transaction = new Transaction().add(instruction);
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.payer, authority]
    );

    return signature;
  }

  /**
   * Set royalty distribution for content
   */
  async setRoyaltyDistribution(
    creator: Keypair,
    contentId: string,
    recipients: Array<{ address: string; percentage: number }>
  ): Promise<string> {
    // Validate total percentage is 100%
    const totalPercentage = recipients.reduce(
      (sum, recipient) => sum + recipient.percentage,
      0
    );
    
    if (totalPercentage !== 100) {
      throw new Error('Total percentage must be 100%');
    }

    // Derive PDA for content account
    const [contentPubkey] = await this.deriveContentAddress(
      creator.publicKey,
      contentId
    );
    
    // Convert percentage to basis points (100% = 10000 basis points)
    const royaltyRecipients = recipients.map(recipient => [
      recipient.address,
      recipient.percentage * 100, // Convert percentage to basis points
    ]) as [string, number][];
    
    // Create instruction data
    const instructionArgs = new SetRoyaltyDistributionArgs({
      royaltyRecipients,
    });
    
    // Define schema for serialization
    const schema = {
      kind: 'struct',
      fields: [
        ['royaltyRecipients', { kind: 'array', items: ['string', 'u16'] }],
      ],
    };
    
    // Serialize instruction data
    const serializedArgs = serializeData({ SetRoyaltyDistributionArgs: schema }, instructionArgs);
    const instructionData = Buffer.alloc(1 + serializedArgs.length);
    
    // Set instruction type
    instructionData.writeUInt8(InstructionType.SetRoyaltyDistribution, 0);
    
    // Write serialized arguments
    serializedArgs.copy(instructionData, 1);

    // Create keys for instruction
    const keys = [
      { pubkey: creator.publicKey, isSigner: true, isWritable: true },
      { pubkey: contentPubkey, isSigner: false, isWritable: true },
    ];
    
    // Add recipient accounts to keys
    recipients.forEach(recipient => {
      keys.push({
        pubkey: new PublicKey(recipient.address),
        isSigner: false,
        isWritable: false,
      });
    });

    // Create instruction
    const instruction = new TransactionInstruction({
      keys,
      programId: this.programId,
      data: instructionData,
    });

    // Create and sign transaction
    const transaction = new Transaction().add(instruction);
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.payer, creator]
    );

    return signature;
  }

  /**
   * Get account balance in SOL
   */
  async getBalance(publicKey: PublicKey): Promise<number> {
    const balance = await this.connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  }
} 