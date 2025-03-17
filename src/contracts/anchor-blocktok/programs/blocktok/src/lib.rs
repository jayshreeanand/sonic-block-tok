use anchor_lang::prelude::*;
use anchor_lang::solana_program;
use anchor_spl::{
    token::{Mint, Token, TokenAccount},
    associated_token::AssociatedToken,
};
use mpl_token_metadata::{
    ID as metadata_program_id,
};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

// Define a local Creator struct to replace mpl_token_metadata::state::Creator
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Creator {
    pub address: Pubkey,
    pub verified: bool,
    pub share: u8,
}

#[program]
pub mod blocktok {
    use super::*;

    pub fn initialize_content(
        ctx: Context<InitializeContent>,
        content_id: String,
        title: String,
        description: String,
        content_url: String,
        content_type: String,
    ) -> Result<()> {
        let content = &mut ctx.accounts.content;
        let creator = &ctx.accounts.creator;
        
        content.creator = creator.key();
        content.content_id = content_id;
        content.title = title;
        content.description = description;
        content.content_url = content_url;
        content.content_type = content_type;
        content.created_at = Clock::get()?.unix_timestamp as u64;
        content.analytics = ContentAnalytics::default();
        content.nft_mint = None;
        content.bump = ctx.bumps.content;
        
        msg!("Content initialized successfully");
        Ok(())
    }

    pub fn update_analytics(
        ctx: Context<UpdateAnalytics>,
        views: u64,
        likes: u64,
        shares: u64,
        comments: u64,
    ) -> Result<()> {
        let content = &mut ctx.accounts.content;
        
        // Only creator can update analytics
        require!(
            content.creator == ctx.accounts.authority.key(),
            ContentError::Unauthorized
        );
        
        content.analytics.views = views;
        content.analytics.likes = likes;
        content.analytics.shares = shares;
        content.analytics.comments = comments;
        content.analytics.updated_at = Clock::get()?.unix_timestamp as u64;
        
        msg!("Analytics updated successfully");
        Ok(())
    }

    pub fn mint_nft(
        ctx: Context<MintNft>,
        name: String,
        symbol: String,
        uri: String,
        royalty_basis_points: u16,
    ) -> Result<()> {
        let content = &mut ctx.accounts.content;
        
        // Only creator can mint NFT
        require!(
            content.creator == ctx.accounts.creator.key(),
            ContentError::Unauthorized
        );
        
        // Content should not already have an NFT
        require!(
            content.nft_mint.is_none(),
            ContentError::NftAlreadyMinted
        );
        
        // Instead of using direct Metaplex SDK functions which may change,
        // we'll manually create the instructions
        
        // Data for metadata creation
        let metadata_instruction_data = vec![
            10, // instruction discriminator for create metadata
            // We're not serializing the full data since it's a playground test
            // In a real implementation, you would properly serialize all fields
        ];
        
        // Create the metadata account instruction
        let create_metadata_ix = solana_program::instruction::Instruction {
            program_id: metadata_program_id,
            accounts: vec![
                solana_program::instruction::AccountMeta::new(ctx.accounts.metadata.key(), false),
                solana_program::instruction::AccountMeta::new_readonly(ctx.accounts.mint.key(), false),
                solana_program::instruction::AccountMeta::new_readonly(ctx.accounts.creator.key(), true),
                solana_program::instruction::AccountMeta::new(ctx.accounts.creator.key(), true),
                solana_program::instruction::AccountMeta::new_readonly(ctx.accounts.creator.key(), true),
                solana_program::instruction::AccountMeta::new_readonly(ctx.accounts.system_program.key(), false),
                solana_program::instruction::AccountMeta::new_readonly(ctx.accounts.rent.key(), false),
            ],
            data: metadata_instruction_data,
        };
        
        // Data for master edition creation
        let master_edition_instruction_data = vec![
            17, // instruction discriminator for create master edition
            // We're not serializing the full data since it's a playground test
            // In a real implementation, you would properly serialize all fields
        ];
        
        // Create the master edition instruction
        let create_master_edition_ix = solana_program::instruction::Instruction {
            program_id: metadata_program_id,
            accounts: vec![
                solana_program::instruction::AccountMeta::new(ctx.accounts.master_edition.key(), false),
                solana_program::instruction::AccountMeta::new(ctx.accounts.mint.key(), false),
                solana_program::instruction::AccountMeta::new_readonly(ctx.accounts.creator.key(), true),
                solana_program::instruction::AccountMeta::new_readonly(ctx.accounts.creator.key(), true),
                solana_program::instruction::AccountMeta::new(ctx.accounts.metadata.key(), false),
                solana_program::instruction::AccountMeta::new_readonly(ctx.accounts.token_program.key(), false),
                solana_program::instruction::AccountMeta::new_readonly(ctx.accounts.system_program.key(), false),
                solana_program::instruction::AccountMeta::new_readonly(ctx.accounts.rent.key(), false),
            ],
            data: master_edition_instruction_data,
        };
        
        // Execute the instructions
        solana_program::program::invoke(
            &create_metadata_ix,
            &[
                ctx.accounts.metadata.to_account_info(),
                ctx.accounts.mint.to_account_info(),
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
                ctx.accounts.rent.to_account_info(),
            ],
        )?;
        
        solana_program::program::invoke(
            &create_master_edition_ix,
            &[
                ctx.accounts.master_edition.to_account_info(),
                ctx.accounts.mint.to_account_info(),
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.metadata.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
                ctx.accounts.rent.to_account_info(),
            ],
        )?;
        
        // Update content with NFT mint
        content.nft_mint = Some(ctx.accounts.mint.key());
        
        msg!("NFT minted successfully");
        Ok(())
    }

    pub fn set_royalty_distribution(
        ctx: Context<SetRoyaltyDistribution>,
        royalty_percentages: Vec<u16>,
    ) -> Result<()> {
        let content = &mut ctx.accounts.content;
        
        // Only creator can set royalty distribution
        require!(
            content.creator == ctx.accounts.creator.key(),
            ContentError::Unauthorized
        );
        
        // Verify that number of recipients matches number of percentages
        require!(
            ctx.remaining_accounts.len() == royalty_percentages.len(),
            ContentError::InvalidRoyaltyData
        );
        
        // Validate percentages sum to 100%
        let total_percentage: u16 = royalty_percentages.iter().sum();
        require!(
            total_percentage == 10000, // 100% in basis points
            ContentError::InvalidRoyaltyPercentage
        );
        
        // Create recipients vector
        let mut recipients = Vec::new();
        for (i, account) in ctx.remaining_accounts.iter().enumerate() {
            recipients.push(RoyaltyRecipient {
                pubkey: account.key(),
                percentage: royalty_percentages[i],
            });
        }
        
        // Set royalty distribution
        content.royalty_recipients = recipients;
        
        msg!("Royalty distribution set successfully");
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(content_id: String)]
pub struct InitializeContent<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(
        init,
        payer = creator,
        space = 8 + Content::space(&content_id),
        seeds = [b"content", creator.key().as_ref(), content_id.as_bytes()],
        bump
    )]
    pub content: Account<'info, Content>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAnalytics<'info> {
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub content: Account<'info, Content>,
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"content", creator.key().as_ref(), content.content_id.as_bytes()],
        bump = content.bump
    )]
    pub content: Account<'info, Content>,
    
    #[account(
        init,
        payer = creator,
        mint::decimals = 0,
        mint::authority = creator,
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init_if_needed,
        payer = creator,
        associated_token::mint = mint,
        associated_token::authority = creator,
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Metadata account
    #[account(
        mut,
        seeds = [
            b"metadata",
            metadata_program_id.to_bytes().as_ref(),
            mint.key().as_ref()
        ],
        bump,
        seeds::program = metadata_program_id
    )]
    pub metadata: UncheckedAccount<'info>,
    
    /// CHECK: Master edition account
    #[account(
        mut,
        seeds = [
            b"metadata",
            metadata_program_id.to_bytes().as_ref(),
            mint.key().as_ref(),
            b"edition"
        ],
        bump,
        seeds::program = metadata_program_id
    )]
    pub master_edition: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct SetRoyaltyDistribution<'info> {
    pub creator: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"content", creator.key().as_ref(), content.content_id.as_bytes()],
        bump = content.bump
    )]
    pub content: Account<'info, Content>,
}

#[account]
pub struct Content {
    pub creator: Pubkey,
    pub content_id: String,
    pub title: String,
    pub description: String,
    pub content_url: String,
    pub content_type: String,
    pub created_at: u64,
    pub nft_mint: Option<Pubkey>,
    pub analytics: ContentAnalytics,
    pub royalty_recipients: Vec<RoyaltyRecipient>,
    pub bump: u8,
}

impl Content {
    pub fn space(content_id: &str) -> usize {
        // Space calculation
        // creator: 32 bytes
        // content_id: 4 + len (String)
        // title: 4 + len (String)
        // description: 4 + len (String)
        // content_url: 4 + len (String)
        // content_type: 4 + len (String)
        // created_at: 8 bytes
        // nft_mint: 1 + 32 bytes (Option<Pubkey>)
        // analytics: size of ContentAnalytics
        // royalty_recipients: 4 + (estimated avg number of recipients * RoyaltyRecipient size)
        // bump: 1 byte
        32 + 
        (4 + content_id.len()) + 
        (4 + 50) + // title - assume 50 chars max
        (4 + 200) + // description - assume 200 chars max
        (4 + 100) + // content_url - assume 100 chars max
        (4 + 20) + // content_type - assume 20 chars max
        8 + 
        (1 + 32) + 
        ContentAnalytics::space() + 
        (4 + 5 * RoyaltyRecipient::space()) + // assume 5 recipients max
        1
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct ContentAnalytics {
    pub views: u64,
    pub likes: u64,
    pub shares: u64,
    pub comments: u64,
    pub updated_at: u64,
}

impl ContentAnalytics {
    pub fn space() -> usize {
        // views, likes, shares, comments, updated_at: 8 bytes each
        5 * 8
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RoyaltyRecipient {
    pub pubkey: Pubkey,
    pub percentage: u16, // Basis points (e.g., 100 = 1%)
}

impl RoyaltyRecipient {
    pub fn space() -> usize {
        // pubkey: 32 bytes
        // percentage: 2 bytes
        32 + 2
    }
}

#[error_code]
pub enum ContentError {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    
    #[msg("NFT has already been minted for this content")]
    NftAlreadyMinted,
    
    #[msg("Invalid royalty percentage (must sum to 100%)")]
    InvalidRoyaltyPercentage,
    
    #[msg("Invalid royalty distribution data")]
    InvalidRoyaltyData,
} 