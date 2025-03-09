use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

use borsh::{BorshDeserialize, BorshSerialize};
use crate::instruction::BlockTokInstruction;
use crate::processor::Processor;

pub mod error;
pub mod instruction;
pub mod processor;
pub mod state;

// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("BlockTok program entrypoint");

    // Deserialize instruction data
    let instruction = BlockTokInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    // Process the instruction
    Processor::process(program_id, accounts, instruction)
} 