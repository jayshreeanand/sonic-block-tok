use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{pubkey::Pubkey, system_program};
use solana_program_test::*;
use solana_sdk::{
    account::Account,
    signature::{Keypair, Signer},
    transaction::Transaction,
};
use spl_token::state::Mint;

use blocktok::{
    instruction::BlockTokInstruction,
    state::{Content, ContentAnalytics},
};

#[tokio::test]
async fn test_mint_nft() {
    // Initialize program test
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "blocktok",
        program_id,
        processor!(blocktok::process_instruction),
    );

    // Setup test accounts
    let creator = Keypair::new();
    let payer = Keypair::new();
    let content_id = String::from("test-content-id");
    
    // Create content account address
    let (content_pubkey, _) = Pubkey::find_program_address(
        &[
            b"content",
            creator.pubkey().as_ref(),
            content_id.as_bytes(),
        ],
        &program_id,
    );

    // Create mint account keypair
    let mint_keypair = Keypair::new();
    
    // Initialize content (would be done separately in a real test)
    let mut content = Content {
        creator: creator.pubkey().to_bytes(),
        content_id: content_id.clone(),
        title: String::from("Test Content"),
        description: String::from("Test Description"),
        content_url: String::from("https://example.com/test-content"),
        content_type: String::from("video"),
        created_at: 1634567890,
        nft_mint: None,
        analytics: ContentAnalytics::default(),
        royalty_distribution: blocktok::state::RoyaltyDistribution::default(),
    };

    // Add accounts with initial balances
    program_test.add_account(
        creator.pubkey(),
        Account {
            lamports: 10_000_000_000,
            data: vec![],
            owner: system_program::id(),
            ..Account::default()
        },
    );
    
    program_test.add_account(
        payer.pubkey(),
        Account {
            lamports: 10_000_000_000,
            data: vec![],
            owner: system_program::id(),
            ..Account::default()
        },
    );

    // Add pre-initialized content account
    let mut content_data = vec![0; 1000]; // Sufficient size for the data
    content.serialize(&mut content_data.as_mut_slice()).unwrap();
    program_test.add_account(
        content_pubkey,
        Account {
            lamports: 1_000_000,
            data: content_data,
            owner: program_id,
            ..Account::default()
        },
    );

    // Start program test
    let (mut banks_client, system_payer, recent_blockhash) = program_test.start().await;
    
    // NFT metadata
    let name = String::from("Test NFT");
    let symbol = String::from("TNFT");
    let uri = String::from("https://example.com/metadata.json");
    let royalty_basis_points = 500; // 5%

    // Create mint NFT instruction
    let instruction = BlockTokInstruction::mint_nft(
        &program_id,
        &creator.pubkey(),
        &content_id,
        &mint_keypair.pubkey(),
        name.clone(),
        symbol.clone(),
        uri.clone(),
        royalty_basis_points,
    );

    // Create and send transaction
    let mut transaction = Transaction::new_with_payer(&[instruction], Some(&system_payer.pubkey()));
    transaction.sign(&[&system_payer, &creator, &mint_keypair], recent_blockhash);

    // Process transaction
    banks_client.process_transaction(transaction).await.unwrap();

    // Get updated content account data
    let content_account = banks_client
        .get_account(content_pubkey)
        .await
        .unwrap()
        .unwrap();

    // Deserialize content data
    let updated_content = Content::try_from_slice(&content_account.data).unwrap();

    // Verify NFT mint was set
    assert!(updated_content.nft_mint.is_some());
    assert_eq!(updated_content.nft_mint.unwrap(), mint_keypair.pubkey().to_bytes());
    
    // Verify mint account was created
    let mint_account = banks_client
        .get_account(mint_keypair.pubkey())
        .await
        .unwrap()
        .unwrap();
    
    // Verify mint account is owned by the SPL Token program
    assert_eq!(mint_account.owner, spl_token::id());
}

#[tokio::test]
async fn test_set_royalty_distribution() {
    // Initialize program test
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "blocktok",
        program_id,
        processor!(blocktok::process_instruction),
    );

    // Setup test accounts
    let creator = Keypair::new();
    let recipient1 = Keypair::new();
    let recipient2 = Keypair::new();
    let content_id = String::from("test-content-id");
    
    // Create content account address
    let (content_pubkey, _) = Pubkey::find_program_address(
        &[
            b"content",
            creator.pubkey().as_ref(),
            content_id.as_bytes(),
        ],
        &program_id,
    );

    // Initialize content (would be done separately in a real test)
    let mut content = Content {
        creator: creator.pubkey().to_bytes(),
        content_id: content_id.clone(),
        title: String::from("Test Content"),
        description: String::from("Test Description"),
        content_url: String::from("https://example.com/test-content"),
        content_type: String::from("video"),
        created_at: 1634567890,
        nft_mint: None,
        analytics: ContentAnalytics::default(),
        royalty_distribution: blocktok::state::RoyaltyDistribution::default(),
    };

    // Add creator account with initial balance
    program_test.add_account(
        creator.pubkey(),
        Account {
            lamports: 10_000_000_000,
            data: vec![],
            owner: system_program::id(),
            ..Account::default()
        },
    );

    // Add pre-initialized content account
    let mut content_data = vec![0; 1000]; // Sufficient size for the data
    content.serialize(&mut content_data.as_mut_slice()).unwrap();
    program_test.add_account(
        content_pubkey,
        Account {
            lamports: 1_000_000,
            data: content_data,
            owner: program_id,
            ..Account::default()
        },
    );

    // Start program test
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;
    
    // Royalty recipient data
    let recipients = vec![
        (recipient1.pubkey(), 70), // 70%
        (recipient2.pubkey(), 30), // 30%
    ];

    // Create set royalty distribution instruction
    let instruction = BlockTokInstruction::set_royalty_distribution(
        &program_id,
        &creator.pubkey(),
        &content_id,
        recipients.clone(),
    );

    // Create and send transaction
    let mut transaction = Transaction::new_with_payer(&[instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &creator], recent_blockhash);

    // Process transaction
    banks_client.process_transaction(transaction).await.unwrap();

    // Get updated content account data
    let content_account = banks_client
        .get_account(content_pubkey)
        .await
        .unwrap()
        .unwrap();

    // Deserialize content data
    let updated_content = Content::try_from_slice(&content_account.data).unwrap();

    // Verify royalty distribution
    assert_eq!(updated_content.royalty_distribution.recipients.len(), 2);
    assert_eq!(updated_content.royalty_distribution.recipients[0].pubkey, recipient1.pubkey().to_bytes());
    assert_eq!(updated_content.royalty_distribution.recipients[0].percentage, 70);
    assert_eq!(updated_content.royalty_distribution.recipients[1].pubkey, recipient2.pubkey().to_bytes());
    assert_eq!(updated_content.royalty_distribution.recipients[1].percentage, 30);
} 