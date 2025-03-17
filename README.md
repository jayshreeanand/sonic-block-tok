# BlockTok

BlockTok is an AI-powered agent that autonomously generates, edits, and publishes short-form videos optimized for social media platforms. Built on the Sonic blockchain, it enables content creators to create, monetize, and track their content across multiple platforms.

## Features

- 🤖 AI-Powered Content Generation

  - Script generation using GPT-4
  - Voice synthesis with ElevenLabs
  - Video creation with Pika Labs
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
- Pika Labs
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

## Environment Variables

Create a `.env.local` file with the following variables:

```env
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
PIKA_LABS_API_KEY=
INJECTIVE_PRIVATE_KEY=
```

## License

MIT
