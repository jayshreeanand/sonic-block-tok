use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{pubkey::Pubkey, system_program};
use solana_program_test::*;
use solana_sdk::{
    account::Account,
    signature::{Keypair, Signer},
    transaction::Transaction,
};

use blocktok::{
    instruction::BlockTokInstruction,
    state::{Content, ContentAnalytics},
};

#[tokio::test]
async fn test_initialize_content() {
    // Initialize program test
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "blocktok",
        program_id,
        processor!(blocktok::process_instruction),
    );

    // Setup test data
    let creator = Keypair::new();
    let content_id = String::from("test-content-id");
    let title = String::from("Test Content");
    let description = String::from("Test Description");
    let content_url = String::from("https://example.com/test-content");
    let content_type = String::from("video");
    let created_at = 1634567890;

    // Add creator account with initial balance
    program_test.add_account(
        creator.pubkey(),
        Account {
            lamports: 1_000_000_000,
            data: vec![],
            owner: system_program::id(),
            ..Account::default()
        },
    );

    // Start program test
    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    // Create content account address
    let (content_pubkey, _) = Pubkey::find_program_address(
        &[
            b"content",
            creator.pubkey().as_ref(),
            content_id.as_bytes(),
        ],
        &program_id,
    );

    // Create initialize content instruction
    let instruction = BlockTokInstruction::initialize_content(
        &program_id,
        &creator.pubkey(),
        content_id.clone(),
        title.clone(),
        description.clone(),
        content_url.clone(),
        content_type.clone(),
        created_at,
    );

    // Create and send transaction
    let mut transaction = Transaction::new_with_payer(&[instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &creator], recent_blockhash);

    // Process transaction
    banks_client.process_transaction(transaction).await.unwrap();

    // Get content account data
    let content_account = banks_client
        .get_account(content_pubkey)
        .await
        .unwrap()
        .unwrap();

    // Deserialize content data
    let content = Content::try_from_slice(&content_account.data).unwrap();

    // Verify content data
    assert_eq!(content.content_id, content_id);
    assert_eq!(content.title, title);
    assert_eq!(content.description, description);
    assert_eq!(content.content_url, content_url);
    assert_eq!(content.content_type, content_type);
    assert_eq!(content.created_at, created_at);
    assert_eq!(content.get_creator(), creator.pubkey());
    assert_eq!(content.nft_mint, None);
    assert_eq!(content.analytics, ContentAnalytics::default());
    assert_eq!(content.royalty_distribution.recipients.len(), 0);
}

#[tokio::test]
async fn test_update_analytics() {
    // Initialize program test
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "blocktok",
        program_id,
        processor!(blocktok::process_instruction),
    );

    // Setup test data
    let creator = Keypair::new();
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
            lamports: 1_000_000_000,
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
    
    // Test data for analytics update
    let views = 1000;
    let likes = 500;
    let shares = 200;
    let comments = 100;
    let updated_at = 1634567900;

    // Create update analytics instruction
    let instruction = BlockTokInstruction::update_analytics(
        &program_id,
        &creator.pubkey(),
        &content_id,
        views,
        likes,
        shares,
        comments,
        updated_at,
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

    // Verify analytics data was updated
    assert_eq!(updated_content.analytics.views, views);
    assert_eq!(updated_content.analytics.likes, likes);
    assert_eq!(updated_content.analytics.shares, shares);
    assert_eq!(updated_content.analytics.comments, comments);
    assert_eq!(updated_content.analytics.updated_at, updated_at);
} 