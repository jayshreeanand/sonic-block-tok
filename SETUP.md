# BlockTok Setup Guide

This guide walks you through setting up and running the BlockTok project, including configuring the blockchain components and required dependencies.

## Prerequisites

- Node.js 18+
- npm or yarn
- Solana CLI (optional, for contract deployment)
- A Solana wallet (Phantom, Solflare, etc.)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/block-tok.git
cd block-tok
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add the required API keys and configuration:

```
# AI Services
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key
RUNWAY_API_KEY=your_runway_key

# Blockchain
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_BLOCKTOK_PROGRAM_ID=3jf8o4DHcTUg71tpP7PdRFGyBrfFKW2H6LBstCfs5vqz
```

## Running the Application

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser to access the application.

## Connecting to the Blockchain

1. **Install a Solana Wallet**: Install a Solana wallet browser extension like Phantom or Solflare.

2. **Connect Your Wallet**: Click the "Connect Wallet" button in the application and select your wallet provider.

3. **Switch to Devnet**: Make sure your wallet is configured to use the Solana devnet network.

4. **Get Devnet SOL**: Acquire some devnet SOL by using the Solana CLI or a faucet:

```bash
solana airdrop 2 your_wallet_address --url devnet
```

Or visit a faucet like https://solfaucet.com/ and select "Devnet".

## Testing Blockchain Features

Once your wallet is connected, you can test these features:

1. **Upload Content**: Go to the upload page and create new content.

2. **View Your Content**: Visit the dashboard to see your uploaded content.

3. **Mint NFTs**: Select a piece of content and mint it as an NFT.

4. **Set Royalty Distribution**: Configure royalty percentages for your minted NFTs.

## Working with the Smart Contract

The Solana program is already deployed at `3jf8o4DHcTUg71tpP7PdRFGyBrfFKW2H6LBstCfs5vqz` on devnet.

If you want to deploy your own version:

1. Navigate to the contract directory:

```bash
cd src/contracts/anchor-blocktok
```

2. Build the program:

```bash
anchor build
```

3. Deploy to devnet:

```bash
anchor deploy --provider.cluster devnet
```

4. Update your `.env.local` file with the new program ID.

## Troubleshooting

- **Wallet Connection Issues**: Ensure your wallet is configured for Solana devnet.
- **Transaction Errors**: Check if you have sufficient SOL in your wallet on devnet.
- **RPC Errors**: If you encounter RPC errors, you might need to use a different RPC provider or set up your own.

## Setting Up UI Components

The project uses a custom UI components based on shadcn/ui. These components are already included in the project, but if you need to add more:

1. Create the component directory structure:

```bash
mkdir -p src/components/ui/button
```

2. Add the component files based on the shadcn/ui templates.

## Getting Help

If you encounter any issues or have questions:

1. Check the Solana developer documentation: https://docs.solana.com/
2. Visit the Anchor framework documentation: https://www.anchor-lang.com/
3. Open an issue in the project repository
