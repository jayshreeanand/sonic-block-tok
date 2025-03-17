# BlockTok

BlockTok is an AI-powered platform that enables content creators to create, monetize, and track their content across multiple platforms. Built on the Solana blockchain, it allows creators to mint their content as NFTs and earn royalties directly from viewers and supporters.

## Features

- 🤖 AI-Powered Content Generation

  - Script generation using GPT-4
  - Voice synthesis with ElevenLabs
  - Video creation with RunwayML
  - Auto-subtitles with Whisper AI

- ⛓️ Blockchain Integration

  - Content tracking on Solana blockchain
  - NFT minting for content ownership
  - Royalty distribution mechanism
  - On-chain analytics tracking

- 💰 Creator Monetization
  - Direct wallet payments
  - Customizable royalty percentages
  - Revenue sharing among collaborators

## Tech Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Solana Blockchain
- Anchor Framework
- Wallet Adapter
- RunwayML SDK
- OpenAI GPT-4

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Blockchain Features

The BlockTok platform includes the following blockchain features:

1. **Content Registration**: Store content metadata on the Solana blockchain
2. **NFT Minting**: Convert content into NFTs with customizable metadata
3. **Analytics Tracking**: Track views, likes, shares, and comments on-chain
4. **Royalty Distribution**: Set up royalty percentages for multiple contributors
5. **Wallet Integration**: Connect with popular Solana wallets like Phantom and Solflare

## API Routes

- `/api/generate` - Main endpoint to generate a video from text input
- `/api/test-video` - Test endpoint for video generation

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# AI Services
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
RUNWAY_API_KEY=

# Blockchain
NEXT_PUBLIC_SOLANA_RPC_URL=
NEXT_PUBLIC_BLOCKTOK_PROGRAM_ID=3jf8o4DHcTUg71tpP7PdRFGyBrfFKW2H6LBstCfs5vqz
```

## Deployment

This project can be deployed on platforms like Vercel, Netlify, or Railway. For Railway deployment, the following environment variables can help bypass build errors:

```env
CI=false
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

## Solana Smart Contracts

The project includes two implementations of Solana smart contracts for NFT minting, content tracking, and monetization:

### 1. Vanilla Solana Implementation (src/contracts/blocktok/)

Pure Rust implementation using Solana's native programming model.

**Features:**

- Content management with metadata and analytics tracking
- NFT minting for digital content
- Royalty distribution mechanism
- On-chain content verification

**Building and Deploying:**

```bash
# Using Solana CLI
cd src/contracts/blocktok
cargo build-bpf
solana program deploy --url devnet target/deploy/blocktok.so
```

### 2. Anchor Framework Implementation (src/contracts/anchor-blocktok/)

Same functionality implemented using the Anchor framework for improved developer experience.

**Features:**

- Simplified account validation
- Structured data handling with Anchor's macros
- Automatic PDA derivation and validation
- Built-in error types with custom messages

**Building and Deploying:**

```bash
# Using Anchor
cd src/contracts/anchor-blocktok
anchor build
anchor deploy --provider.cluster devnet
```

### Deployed Program

The Anchor-based BlockTok program is currently deployed on Solana devnet at the following address:

```
3jf8o4DHcTUg71tpP7PdRFGyBrfFKW2H6LBstCfs5vqz
```

## License

MIT
