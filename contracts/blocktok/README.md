# BlockTok Smart Contracts

This directory contains the Solana smart contracts for the BlockTok platform, which enable creators to mint NFTs from their content, track analytics, and manage royalty distributions.

## Smart Contract Architecture

The contracts are organized as follows:

- `lib.rs`: Main entry point for the program
- `error.rs`: Custom error definitions
- `instruction.rs`: Instruction definitions and creation functions
- `processor.rs`: Implementation of instruction processing logic
- `state.rs`: Data structures for on-chain storage
- `metaplex_token_metadata.rs`: Stub for Metaplex Token Metadata program integration

## Features

### Content Management

- Initialize content with metadata
- Track analytics for views, likes, shares, and comments
- Associate content with NFTs

### NFT Minting

- Mint NFTs from content
- Set royalty percentage
- Manage NFT metadata

### Royalty Distribution

- Set royalty distribution among multiple recipients
- Validate royalty percentages

## Building the Contract

```bash
cd src/contracts/blocktok
cargo build-bpf
```

## Deploying to Solana

After building, you can deploy the program to Solana using the Solana CLI:

```bash
solana program deploy target/deploy/blocktok.so
```

## Integration with Frontend

The contract is designed to work with the BlockTok frontend, which uses the following environment variables:

```
SOLANA_PRIVATE_KEY=your_private_key
SOLANA_PROGRAM_ID=your_deployed_program_id
```

## Testing

You can test the contract using the Solana test framework:

```bash
cargo test-bpf
```

## Program ID

Once deployed, your program will have a unique Program ID. This ID needs to be used in the frontend to interact with the contract.

## Documentation

For more information on Solana contract development:

1. [Solana Program Development](https://docs.solana.com/developing/programming-model/overview)
2. [SPL Token Documentation](https://spl.solana.com/token)
3. [Metaplex Token Metadata](https://docs.metaplex.com/programs/token-metadata/overview)
