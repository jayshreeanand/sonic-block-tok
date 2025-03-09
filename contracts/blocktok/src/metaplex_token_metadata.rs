use solana_program::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
};

// Declare the metaplex token metadata program ID
pub const ID: Pubkey = solana_program::pubkey!("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

/// Metaplex Token Metadata program state
pub mod state {
    use solana_program::pubkey::Pubkey;
    
    /// Creator structure for NFT metadata
    #[derive(Clone)]
    pub struct Creator {
        pub address: Pubkey,
        pub verified: bool,
        pub share: u8,
    }
}

/// Metaplex Token Metadata program instructions
pub mod instruction {
    use super::*;
    use solana_program::system_program;
    
    /// Creates a CreateMetadataAccounts instruction
    #[allow(clippy::too_many_arguments)]
    pub fn create_metadata_accounts_v2(
        program_id: Pubkey,
        metadata_account: Pubkey,
        mint: Pubkey,
        mint_authority: Pubkey,
        payer: Pubkey,
        update_authority: Pubkey,
        name: String,
        symbol: String,
        uri: String,
        creators: Option<Vec<super::state::Creator>>,
        seller_fee_basis_points: u16,
        update_authority_is_signer: bool,
        is_mutable: bool,
        collection: Option<Pubkey>,
        uses: Option<u64>,
    ) -> Instruction {
        // This is a stub implementation that mimics the structure of the 
        // Metaplex instruction without the actual implementation details.
        // In a real scenario, you would use the actual Metaplex crate.
        
        let mut accounts = vec![
            AccountMeta::new(metadata_account, false),
            AccountMeta::new_readonly(mint, false),
            AccountMeta::new_readonly(mint_authority, true),
            AccountMeta::new(payer, true),
            AccountMeta::new_readonly(update_authority, update_authority_is_signer),
            AccountMeta::new_readonly(system_program::id(), false),
        ];
        
        // Placeholder data (in a real implementation this would be correctly serialized)
        let data = vec![0u8; 1];
        
        Instruction {
            program_id,
            accounts,
            data,
        }
    }
} 