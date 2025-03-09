use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};

use borsh::{BorshDeserialize, BorshSerialize};
use spl_token::{instruction as token_instruction, state::Mint};
use spl_associated_token_account::instruction as associated_token_account_instruction;

use crate::{
    error::BlockTokError,
    instruction::BlockTokInstruction,
    state::{Content, ContentAnalytics, RoyaltyDistribution, RoyaltyRecipient},
};

/// Program processor
pub struct Processor;

impl Processor {
    /// Process BlockTok instructions
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: BlockTokInstruction,
    ) -> ProgramResult {
        match instruction_data {
            BlockTokInstruction::InitializeContent {
                content_id,
                title,
                description,
                content_url,
                content_type,
                created_at,
            } => Self::process_initialize_content(
                program_id,
                accounts,
                content_id,
                title,
                description,
                content_url,
                content_type,
                created_at,
            ),
            
            BlockTokInstruction::MintNFT {
                name,
                symbol,
                uri,
                royalty_basis_points,
            } => Self::process_mint_nft(
                program_id,
                accounts,
                name,
                symbol,
                uri,
                royalty_basis_points,
            ),
            
            BlockTokInstruction::UpdateAnalytics {
                views,
                likes,
                shares,
                comments,
                updated_at,
            } => Self::process_update_analytics(
                program_id,
                accounts,
                views,
                likes,
                shares,
                comments,
                updated_at,
            ),
            
            BlockTokInstruction::SetRoyaltyDistribution {
                royalty_recipients,
            } => Self::process_set_royalty_distribution(
                program_id,
                accounts,
                royalty_recipients,
            ),
        }
    }
    
    /// Process InitializeContent instruction
    pub fn process_initialize_content(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        content_id: String,
        title: String,
        description: String,
        content_url: String,
        content_type: String,
        created_at: u64,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        
        // Get accounts
        let creator_info = next_account_info(account_info_iter)?;
        let content_account_info = next_account_info(account_info_iter)?;
        let system_program_info = next_account_info(account_info_iter)?;
        
        // Check creator is signer
        if !creator_info.is_signer {
            return Err(BlockTokError::Unauthorized.into());
        }
        
        // Derive PDA for content account
        let (content_pubkey, bump_seed) = Pubkey::find_program_address(
            &[b"content", creator_info.key.as_ref(), content_id.as_bytes()],
            program_id,
        );
        
        // Verify content account
        if content_pubkey != *content_account_info.key {
            return Err(ProgramError::InvalidAccountData);
        }
        
        // Calculate account size
        let account_size = Content::get_account_size(
            &content_id,
            &title,
            &description,
            &content_url,
            &content_type,
        );
        
        // Create content account
        let rent = Rent::get()?;
        let rent_lamports = rent.minimum_balance(account_size);
        
        // Create PDA account
        invoke_signed(
            &system_instruction::create_account(
                creator_info.key,
                &content_pubkey,
                rent_lamports,
                account_size as u64,
                program_id,
            ),
            &[
                creator_info.clone(),
                content_account_info.clone(),
                system_program_info.clone(),
            ],
            &[&[b"content", creator_info.key.as_ref(), content_id.as_bytes(), &[bump_seed]]],
        )?;
        
        // Initialize content data
        let content = Content {
            creator: creator_info.key.to_bytes(),
            content_id,
            title,
            description,
            content_url,
            content_type,
            created_at,
            nft_mint: None,
            analytics: ContentAnalytics::default(),
            royalty_distribution: RoyaltyDistribution::default(),
        };
        
        // Save content data
        content.serialize(&mut *content_account_info.data.borrow_mut())?;
        
        msg!("Content initialized successfully");
        
        Ok(())
    }
    
    /// Process MintNFT instruction
    pub fn process_mint_nft(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        name: String,
        symbol: String,
        uri: String,
        royalty_basis_points: u16,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        
        // Get accounts
        let creator_info = next_account_info(account_info_iter)?;
        let content_account_info = next_account_info(account_info_iter)?;
        let mint_info = next_account_info(account_info_iter)?;
        let token_account_info = next_account_info(account_info_iter)?;
        let metadata_account_info = next_account_info(account_info_iter)?;
        let rent_info = next_account_info(account_info_iter)?;
        let system_program_info = next_account_info(account_info_iter)?;
        let token_program_info = next_account_info(account_info_iter)?;
        let token_metadata_program_info = next_account_info(account_info_iter)?;
        let associated_token_program_info = next_account_info(account_info_iter)?;
        
        // Check creator is signer
        if !creator_info.is_signer {
            return Err(BlockTokError::Unauthorized.into());
        }
        
        // Load content account data
        let mut content = Content::try_from_slice(&content_account_info.data.borrow())?;
        
        // Check if creator is the owner
        if content.get_creator() != *creator_info.key {
            return Err(BlockTokError::Unauthorized.into());
        }
        
        // Check if NFT already minted
        if content.nft_mint.is_some() {
            return Err(ProgramError::AccountAlreadyInitialized);
        }
        
        // Initialize mint account
        let rent = &Rent::from_account_info(rent_info)?;
        
        // Create mint account
        invoke(
            &system_instruction::create_account(
                creator_info.key,
                mint_info.key,
                rent.minimum_balance(Mint::LEN),
                Mint::LEN as u64,
                &spl_token::id(),
            ),
            &[creator_info.clone(), mint_info.clone(), system_program_info.clone()],
        )?;
        
        // Initialize mint
        invoke(
            &token_instruction::initialize_mint(
                &spl_token::id(),
                mint_info.key,
                creator_info.key,
                Some(creator_info.key),
                0,
            )?,
            &[mint_info.clone(), rent_info.clone(), token_program_info.clone()],
        )?;
        
        // Create associated token account
        invoke(
            &associated_token_account_instruction::create_associated_token_account(
                creator_info.key,
                creator_info.key,
                mint_info.key,
            ),
            &[
                creator_info.clone(),
                token_account_info.clone(),
                creator_info.clone(),
                mint_info.clone(),
                system_program_info.clone(),
                token_program_info.clone(),
                rent_info.clone(),
                associated_token_program_info.clone(),
            ],
        )?;
        
        // Mint token
        invoke(
            &token_instruction::mint_to(
                &spl_token::id(),
                mint_info.key,
                token_account_info.key,
                creator_info.key,
                &[],
                1,
            )?,
            &[
                mint_info.clone(),
                token_account_info.clone(),
                creator_info.clone(),
                token_program_info.clone(),
            ],
        )?;
        
        // Create metadata account
        let creators = vec![
            metaplex_token_metadata::state::Creator {
                address: *creator_info.key,
                verified: true,
                share: 100,
            },
        ];
        
        // Create metadata
        invoke(
            &metaplex_token_metadata::instruction::create_metadata_accounts_v2(
                *token_metadata_program_info.key,
                *metadata_account_info.key,
                *mint_info.key,
                *creator_info.key,
                *creator_info.key,
                *creator_info.key,
                name,
                symbol,
                uri,
                Some(creators),
                royalty_basis_points,
                true,
                true,
                None,
                None,
            ),
            &[
                metadata_account_info.clone(),
                mint_info.clone(),
                creator_info.clone(),
                creator_info.clone(),
                token_metadata_program_info.clone(),
                rent_info.clone(),
            ],
        )?;
        
        // Update content with NFT mint
        content.set_nft_mint(mint_info.key);
        content.serialize(&mut *content_account_info.data.borrow_mut())?;
        
        msg!("NFT minted successfully");
        
        Ok(())
    }
    
    /// Process UpdateAnalytics instruction
    pub fn process_update_analytics(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        views: u64,
        likes: u64,
        shares: u64,
        comments: u64,
        updated_at: u64,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        
        // Get accounts
        let authority_info = next_account_info(account_info_iter)?;
        let content_account_info = next_account_info(account_info_iter)?;
        
        // Check authority is signer
        if !authority_info.is_signer {
            return Err(BlockTokError::Unauthorized.into());
        }
        
        // Load content account data
        let mut content = Content::try_from_slice(&content_account_info.data.borrow())?;
        
        // Check if authority is the owner
        if content.get_creator() != *authority_info.key {
            return Err(BlockTokError::Unauthorized.into());
        }
        
        // Update analytics
        content.analytics.views = views;
        content.analytics.likes = likes;
        content.analytics.shares = shares;
        content.analytics.comments = comments;
        content.analytics.updated_at = updated_at;
        
        // Save content data
        content.serialize(&mut *content_account_info.data.borrow_mut())?;
        
        msg!("Analytics updated successfully");
        
        Ok(())
    }
    
    /// Process SetRoyaltyDistribution instruction
    pub fn process_set_royalty_distribution(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        royalty_recipients: Vec<(String, u16)>,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        
        // Get accounts
        let creator_info = next_account_info(account_info_iter)?;
        let content_account_info = next_account_info(account_info_iter)?;
        
        // Check creator is signer
        if !creator_info.is_signer {
            return Err(BlockTokError::Unauthorized.into());
        }
        
        // Load content account data
        let mut content = Content::try_from_slice(&content_account_info.data.borrow())?;
        
        // Check if creator is the owner
        if content.get_creator() != *creator_info.key {
            return Err(BlockTokError::Unauthorized.into());
        }
        
        // Create new royalty distribution
        let mut royalty_distribution = RoyaltyDistribution::default();
        
        // Add all recipients
        let recipient_accounts = accounts.iter().skip(2);
        for ((pubkey_str, percentage), account_info) in royalty_recipients.iter().zip(recipient_accounts) {
            // Parse pubkey from string
            let pubkey = match Pubkey::try_from_slice(pubkey_str.as_bytes()) {
                Ok(pubkey) => pubkey,
                Err(_) => return Err(BlockTokError::InvalidMetadata.into()),
            };
            
            // Verify account matches pubkey
            if pubkey != *account_info.key {
                return Err(ProgramError::InvalidAccountData);
            }
            
            // Add recipient
            royalty_distribution.add_recipient(account_info.key, *percentage);
        }
        
        // Validate percentages sum to 100%
        if !royalty_distribution.validate_percentages() {
            return Err(BlockTokError::InvalidRoyaltyPercentage.into());
        }
        
        // Update content royalty distribution
        content.royalty_distribution = royalty_distribution;
        
        // Save content data
        content.serialize(&mut *content_account_info.data.borrow_mut())?;
        
        msg!("Royalty distribution set successfully");
        
        Ok(())
    }
} 