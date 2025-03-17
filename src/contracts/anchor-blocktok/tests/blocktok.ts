import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Blocktok } from "../target/types/blocktok";
import { expect } from "chai";
import { Keypair, PublicKey } from "@solana/web3.js";

describe("blocktok", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Blocktok as Program<Blocktok>;
  const creator = anchor.web3.Keypair.generate();
  const contentId = "test-content-id";
  const title = "Test Content";
  const description = "Test content description";
  const contentUrl = "https://example.com/content";
  const contentType = "video";

  // Create content account PDA
  const [contentPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("content"),
      creator.publicKey.toBuffer(),
      Buffer.from(contentId),
    ],
    program.programId
  );

  it("Airdrop SOL to creator", async () => {
    const airdropSignature = await provider.connection.requestAirdrop(
      creator.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    
    await provider.connection.confirmTransaction(airdropSignature);
    
    const balance = await provider.connection.getBalance(creator.publicKey);
    expect(balance).to.be.greaterThan(0);
  });

  it("Initialize content", async () => {
    await program.methods
      .initializeContent(
        contentId,
        title,
        description,
        contentUrl,
        contentType
      )
      .accounts({
        creator: creator.publicKey,
        content: contentPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([creator])
      .rpc();

    // Fetch the created content account
    const contentAccount = await program.account.content.fetch(contentPda);
    
    // Verify the content data
    expect(contentAccount.creator.toString()).to.equal(creator.publicKey.toString());
    expect(contentAccount.contentId).to.equal(contentId);
    expect(contentAccount.title).to.equal(title);
    expect(contentAccount.description).to.equal(description);
    expect(contentAccount.contentUrl).to.equal(contentUrl);
    expect(contentAccount.contentType).to.equal(contentType);
    expect(contentAccount.nftMint).to.equal(null);
    expect(contentAccount.analytics.views.toString()).to.equal("0");
    expect(contentAccount.analytics.likes.toString()).to.equal("0");
    expect(contentAccount.analytics.shares.toString()).to.equal("0");
    expect(contentAccount.analytics.comments.toString()).to.equal("0");
  });

  it("Update analytics", async () => {
    const views = new anchor.BN(1000);
    const likes = new anchor.BN(500);
    const shares = new anchor.BN(200);
    const comments = new anchor.BN(100);
    
    await program.methods
      .updateAnalytics(
        views,
        likes,
        shares,
        comments
      )
      .accounts({
        authority: creator.publicKey,
        content: contentPda,
      })
      .signers([creator])
      .rpc();

    // Fetch the updated content account
    const contentAccount = await program.account.content.fetch(contentPda);
    
    // Verify the analytics data
    expect(contentAccount.analytics.views.toString()).to.equal(views.toString());
    expect(contentAccount.analytics.likes.toString()).to.equal(likes.toString());
    expect(contentAccount.analytics.shares.toString()).to.equal(shares.toString());
    expect(contentAccount.analytics.comments.toString()).to.equal(comments.toString());
  });

  // Additional tests for NFT minting and royalty distribution can be added here
}); 