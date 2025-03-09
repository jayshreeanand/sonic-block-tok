use solana_program::program_error::ProgramError;
use thiserror::Error;

/// Custom errors for BlockTok program
#[derive(Error, Debug, Copy, Clone)]
pub enum BlockTokError {
    /// Invalid instruction data passed
    #[error("Invalid instruction data")]
    InvalidInstruction,

    /// Account not authorized to perform this action
    #[error("Account not authorized")]
    Unauthorized,

    /// Invalid NFT metadata
    #[error("Invalid NFT metadata")]
    InvalidMetadata,

    /// Content already exists
    #[error("Content already exists")]
    ContentAlreadyExists,

    /// Content not found
    #[error("Content not found")]
    ContentNotFound,

    /// Invalid royalty percentage
    #[error("Invalid royalty percentage")]
    InvalidRoyaltyPercentage,

    /// Invalid content data
    #[error("Invalid content data")]
    InvalidContentData,
}

impl From<BlockTokError> for ProgramError {
    fn from(e: BlockTokError) -> Self {
        ProgramError::Custom(e as u32)
    }
} 