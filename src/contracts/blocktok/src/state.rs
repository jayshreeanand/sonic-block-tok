use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::{Pubkey, PUBKEY_BYTES};

/// Represents a content created in the BlockTok platform
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Content {
    /// The owner/creator of the content
    pub creator: [u8; PUBKEY_BYTES],
    
    /// Unique content ID (hash of the content or URL)
    pub content_id: String,
    
    /// Content title or name
    pub title: String,
    
    /// Content description
    pub description: String,
    
    /// Content URL or reference
    pub content_url: String,
    
    /// Content type (video, audio, etc.)
    pub content_type: String,
    
    /// Timestamp when the content was created
    pub created_at: u64,
    
    /// NFT mint address if NFT has been minted, otherwise empty
    pub nft_mint: Option<[u8; PUBKEY_BYTES]>,
    
    /// Analytics data
    pub analytics: ContentAnalytics,
    
    /// Royalty distribution
    pub royalty_distribution: RoyaltyDistribution,
}

/// Analytics data for content
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, Default)]
pub struct ContentAnalytics {
    /// Number of views
    pub views: u64,
    
    /// Number of likes
    pub likes: u64,
    
    /// Number of shares
    pub shares: u64,
    
    /// Number of comments
    pub comments: u64,
    
    /// Timestamp of the last update
    pub updated_at: u64,
}

/// Royalty distribution for content
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, Default)]
pub struct RoyaltyDistribution {
    /// List of royalty recipients and their percentages (basis points)
    pub recipients: Vec<RoyaltyRecipient>,
}

/// A single royalty recipient
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct RoyaltyRecipient {
    /// Public key of the recipient
    pub pubkey: [u8; PUBKEY_BYTES],
    
    /// Percentage in basis points (e.g., 500 = 5%)
    pub percentage: u16,
}

impl Content {
    /// Get the size this account will take in storage
    pub fn get_account_size(
        content_id: &str,
        title: &str,
        description: &str,
        content_url: &str,
        content_type: &str,
    ) -> usize {
        // Base size + string lengths
        8 + // Discriminator
        PUBKEY_BYTES + // creator
        4 + content_id.len() + // content_id (length prefix + string)
        4 + title.len() + // title (length prefix + string)
        4 + description.len() + // description (length prefix + string)
        4 + content_url.len() + // content_url (length prefix + string)
        4 + content_type.len() + // content_type (length prefix + string)
        8 + // created_at
        1 + PUBKEY_BYTES + // nft_mint (1 byte for Option variant + pubkey)
        ContentAnalytics::size() + // analytics
        RoyaltyDistribution::size() // royalty_distribution
    }
    
    /// Get the public key of the creator
    pub fn get_creator(&self) -> Pubkey {
        Pubkey::new_from_array(self.creator)
    }
    
    /// Get the NFT mint if it exists
    pub fn get_nft_mint(&self) -> Option<Pubkey> {
        self.nft_mint.map(Pubkey::new_from_array)
    }
    
    /// Set the NFT mint
    pub fn set_nft_mint(&mut self, mint: &Pubkey) {
        self.nft_mint = Some(mint.to_bytes());
    }
}

impl ContentAnalytics {
    /// Get the size of ContentAnalytics in storage
    pub fn size() -> usize {
        8 + // views
        8 + // likes
        8 + // shares
        8 + // comments
        8   // updated_at
    }
}

impl RoyaltyDistribution {
    /// Get the size of RoyaltyDistribution in storage
    pub fn size() -> usize {
        // Base size for vector
        4 + // length prefix
        // Each recipient takes PUBKEY_BYTES + 2 bytes
        0 // initialized with no recipients
    }
    
    /// Get a recipient's public key
    pub fn get_recipient_pubkey(&self, index: usize) -> Option<Pubkey> {
        self.recipients.get(index).map(|recipient| Pubkey::new_from_array(recipient.pubkey))
    }
    
    /// Validate that percentages sum to 10000 (100%)
    pub fn validate_percentages(&self) -> bool {
        let sum: u32 = self.recipients.iter()
            .map(|recipient| recipient.percentage as u32)
            .sum();
        sum == 10000
    }
    
    /// Add a new recipient
    pub fn add_recipient(&mut self, pubkey: &Pubkey, percentage: u16) {
        self.recipients.push(RoyaltyRecipient {
            pubkey: pubkey.to_bytes(),
            percentage,
        });
    }
} 