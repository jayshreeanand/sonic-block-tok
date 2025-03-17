use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    system_program, sysvar,
};

/// Instructions for the BlockTok Program
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub enum BlockTokInstruction {
    /// Initialize a new content account
    /// 
    /// Accounts expected:
    /// 0. `[signer]` Creator account (fee payer and authority)
    /// 1. `[writable]` Content account (PDA, to be initialized)
    /// 2. `[]` System program
    InitializeContent {
        /// Unique content ID (hash of the content or URL)
        content_id: String,
        /// Content title or name
        title: String,
        /// Content description
        description: String,
        /// Content URL or reference
        content_url: String,
        /// Content type (video, audio, etc.)
        content_type: String,
        /// Timestamp when the content was created
        created_at: u64,
    },

    /// Mint NFT for content
    /// 
    /// Accounts expected:
    /// 0. `[signer]` Creator account (fee payer and mint authority)
    /// 1. `[writable]` Content account (PDA, already initialized)
    /// 2. `[writable]` NFT mint account (to be initialized)
    /// 3. `[writable]` NFT token account (to be initialized)
    /// 4. `[writable]` NFT metadata account (PDA, to be initialized)
    /// 5. `[]` Rent sysvar
    /// 6. `[]` System program
    /// 7. `[]` Token program
    /// 8. `[]` Token metadata program
    /// 9. `[]` Associated token account program
    MintNFT {
        /// NFT name
        name: String,
        /// NFT symbol
        symbol: String,
        /// NFT URI (metadata JSON)
        uri: String,
        /// Royalty percentage basis points (e.g., 500 = 5%)
        royalty_basis_points: u16,
    },

    /// Update content analytics
    /// 
    /// Accounts expected:
    /// 0. `[signer]` Authority account (must be the creator)
    /// 1. `[writable]` Content account (PDA, already initialized)
    UpdateAnalytics {
        /// Number of views
        views: u64,
        /// Number of likes
        likes: u64,
        /// Number of shares
        shares: u64,
        /// Number of comments
        comments: u64,
        /// Timestamp of the update
        updated_at: u64,
    },

    /// Set content royalties distribution
    /// 
    /// Accounts expected:
    /// 0. `[signer]` Creator account (fee payer and authority)
    /// 1. `[writable]` Content account (PDA, already initialized)
    /// 2+ `[]` Variable number of royalty recipient accounts
    SetRoyaltyDistribution {
        /// Vector of (pubkey as string, percentage basis points)
        /// Total should sum to 10000 (100%)
        royalty_recipients: Vec<(String, u16)>,
    },
}

impl BlockTokInstruction {
    /// Creates an instruction to initialize content
    pub fn initialize_content(
        program_id: &Pubkey,
        creator: &Pubkey,
        content_id: String,
        title: String,
        description: String,
        content_url: String,
        content_type: String,
        created_at: u64,
    ) -> Instruction {
        // Derive PDA for content account
        let (content_pubkey, _) = Pubkey::find_program_address(
            &[b"content", creator.as_ref(), content_id.as_bytes()],
            program_id,
        );

        Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new_readonly(*creator, true),
                AccountMeta::new(content_pubkey, false),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
            data: BlockTokInstruction::InitializeContent {
                content_id,
                title,
                description,
                content_url,
                content_type,
                created_at,
            }
            .try_to_vec()
            .unwrap(),
        }
    }

    /// Creates an instruction to mint an NFT for content
    pub fn mint_nft(
        program_id: &Pubkey,
        creator: &Pubkey,
        content_id: &String,
        mint: &Pubkey,
        token_account: &Pubkey,
        name: String,
        symbol: String,
        uri: String,
        royalty_basis_points: u16,
    ) -> Instruction {
        // Derive PDA for content account
        let (content_pubkey, _) = Pubkey::find_program_address(
            &[b"content", creator.as_ref(), content_id.as_bytes()],
            program_id,
        );

        // Derive PDA for metadata account
        let (metadata_pubkey, _) = Pubkey::find_program_address(
            &[
                b"metadata",
                metaplex_token_metadata::ID.as_ref(),
                mint.as_ref(),
            ],
            &metaplex_token_metadata::ID,
        );

        Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new(*creator, true),
                AccountMeta::new(content_pubkey, false),
                AccountMeta::new(*mint, false),
                AccountMeta::new(*token_account, false),
                AccountMeta::new(metadata_pubkey, false),
                AccountMeta::new_readonly(sysvar::rent::id(), false),
                AccountMeta::new_readonly(system_program::id(), false),
                AccountMeta::new_readonly(spl_token::id(), false),
                AccountMeta::new_readonly(metaplex_token_metadata::ID, false),
                AccountMeta::new_readonly(spl_associated_token_account::id(), false),
            ],
            data: BlockTokInstruction::MintNFT {
                name,
                symbol,
                uri,
                royalty_basis_points,
            }
            .try_to_vec()
            .unwrap(),
        }
    }

    /// Creates an instruction to update content analytics
    pub fn update_analytics(
        program_id: &Pubkey,
        authority: &Pubkey,
        content_id: &String,
        views: u64,
        likes: u64,
        shares: u64,
        comments: u64,
        updated_at: u64,
    ) -> Instruction {
        // Derive PDA for content account
        let (content_pubkey, _) = Pubkey::find_program_address(
            &[b"content", authority.as_ref(), content_id.as_bytes()],
            program_id,
        );

        Instruction {
            program_id: *program_id,
            accounts: vec![
                AccountMeta::new_readonly(*authority, true),
                AccountMeta::new(content_pubkey, false),
            ],
            data: BlockTokInstruction::UpdateAnalytics {
                views,
                likes,
                shares,
                comments,
                updated_at,
            }
            .try_to_vec()
            .unwrap(),
        }
    }

    /// Creates an instruction to set royalty distribution
    pub fn set_royalty_distribution(
        program_id: &Pubkey,
        creator: &Pubkey,
        content_id: &String,
        royalty_recipients: Vec<(String, u16)>,
        recipient_accounts: &[Pubkey],
    ) -> Instruction {
        // Derive PDA for content account
        let (content_pubkey, _) = Pubkey::find_program_address(
            &[b"content", creator.as_ref(), content_id.as_bytes()],
            program_id,
        );

        // Build account metas
        let mut accounts = vec![
            AccountMeta::new_readonly(*creator, true),
            AccountMeta::new(content_pubkey, false),
        ];

        // Add recipient accounts
        for recipient in recipient_accounts {
            accounts.push(AccountMeta::new_readonly(*recipient, false));
        }

        Instruction {
            program_id: *program_id,
            accounts,
            data: BlockTokInstruction::SetRoyaltyDistribution {
                royalty_recipients,
            }
            .try_to_vec()
            .unwrap(),
        }
    }
} 