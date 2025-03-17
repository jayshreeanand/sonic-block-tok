use anchor_lang::prelude::*;

declare_id!("35SchvCZCEA3Kwd777MftVbhS8FEZxD7vvVNw7SxLsVB");

#[program]
pub mod blocktok {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
