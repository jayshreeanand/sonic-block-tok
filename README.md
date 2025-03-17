# BlockTok

BlockTok is an AI-powered agent that autonomously generates, edits, and publishes short-form videos optimized for social media platforms. Built on the Sonic blockchain, it enables content creators to create, monetize, and track their content across multiple platforms.

## Features

- 🤖 AI-Powered Content Generation

  - Script generation using GPT-4
  - Voice synthesis with ElevenLabs
  - Video creation with RunwayML
  - Auto-subtitles with Whisper AI

- ⛓️ Blockchain Integration

  - NFT minting for exclusive content
  - On-chain analytics tracking
  - Smart contract-based monetization

- 📱 Multi-Platform Publishing
  - TikTok
  - Instagram Reels
  - YouTube Shorts
  - X (Twitter)

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Injective Blockchain
- OpenAI GPT-4
- ElevenLabs
- RunwayML SDK
- Whisper AI

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

## API Routes

- `/api/generate` - Main endpoint to generate a video from text input
- `/api/test-video` - Test endpoint for video generation

## Environment Variables

Create a `.env.local` file with the following variables:

```env
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
RUNWAY_API_KEY=
INJECTIVE_PRIVATE_KEY=
```

## Deployment

This project can be deployed on platforms like Vercel, Netlify, or Railway. For Railway deployment, the following environment variables can help bypass build errors:

```env
CI=false
NEXT_IGNORE_TYPESCRIPT_ERRORS=true
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

### Environment Variables for Blockchain Integration

```
SOLANA_PRIVATE_KEY=your_solana_private_key
SOLANA_PROGRAM_ID=your_deployed_program_id
```

## License

MIT
