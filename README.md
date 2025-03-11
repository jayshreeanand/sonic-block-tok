# BlockTok AI

<div align="center">
  <img src="public/blocktok-logo.svg" alt="BlockTok AI Logo" width="200" height="200" />
  <h3>AI-Generated Videos on the Sonic Blockchain</h3>
</div>

BlockTok AI is an AI-powered short-form video generation platform on the Sonic blockchain that revolutionizes user engagement by tokenizing attention. Users earn rewards for watching, sharing, and interacting with AI-generated content, while creators can monetize their content through onchain ad revenue, NFTs, and decentralized marketing campaigns.

## 🚀 Features

- **AI Video Generation**: Create AI-generated short-form videos with customizable options
  - **Text-to-Video**: Generate videos from text descriptions using Vadoo AI
  - **Style Presets**: Apply different artistic styles to generated videos
  - **Video Templates**: Use pre-made templates for quick creation
- **Token Rewards**: Earn SOL tokens for watching, sharing, and interacting with content
- **NFT Marketplace**: Mint videos as NFTs on the Sonic blockchain
- **Creator Economy**: Monetize content through various revenue streams
- **Campaign Marketplace**: Create marketing campaigns to promote content
- **Wallet Integration**: Connect your Sonic wallet to manage tokens and NFTs

## 🔄 Application Flow

```mermaid
graph TD
    A[User] -->|Connects Wallet| B[Authentication]
    A -->|Enters Text Prompt| C[Video Generation]
    C -->|Uses Vadoo API| D[AI Processing]
    D -->|Returns Video| E[Generated Video]
    E -->|User Action| F{Decision}
    F -->|Download| G[Local Storage]
    F -->|Mint as NFT| H[Blockchain]
    F -->|Publish| I[Content Feed]
    A -->|Watches Videos| J[Content Consumption]
    J -->|Engagement| K[Token Rewards]
    K -->|Transferred to| L[User Wallet]
    H -->|Listed in| M[NFT Marketplace]
    A -->|Creates| N[Marketing Campaign]
    N -->|Promotes| I
    I -->|Viewed by| A
```

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS
- **Blockchain**: Sonic Protocol, Sonic SDK
- **AI Integration**:
  - Vadoo AI API for text-to-video generation
  - Custom parameter configuration for high-quality results
- **Authentication**: Wallet-based authentication with Sonic
- **Styling**: TailwindCSS with custom components

## AI Video Generation Process

1. **Input**: User provides a text prompt describing the desired video
2. **Processing**: The prompt is sent to Vadoo AI with customized parameters
3. **Generation**: AI generates the video based on the prompt
4. **Delivery**: The completed video is delivered to the user
5. **Actions**: User can download, mint as NFT, or publish to the feed

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

## 🔒 Environment Setup

To use the video generation feature, you need to set up the following environment variables:

```
NEXT_PUBLIC_VADOO_API_KEY=your_vadoo_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

You can add these to a `.env.local` file in the root of the project.

## Project Architecture

The project follows a modern Next.js architecture with:

- App Router for routing
- Server Components for improved performance
- Server Actions for backend functionality
- Client Components for interactive elements

```
src/
├── app/                 # Next.js app router pages
│   ├── api/             # API routes including Vadoo webhook
│   ├── create/          # Video creation page
│   └── ...              # Other app pages
├── components/          # React components
│   ├── layout/          # Layout components
│   ├── ui/              # UI components
│   ├── video/           # Video-related components
│   └── wallet/          # Wallet integration components
├── contexts/            # React contexts for state management
│   └── WalletContext.tsx # Wallet connection state
├── lib/                 # Utility functions and types
│   ├── mock-data.ts     # Mock data for development
│   ├── textToVideoApi.ts # Vadoo API integration
│   ├── types.ts         # TypeScript type definitions
│   ├── utils.ts         # Utility functions
│   └── wallet.ts        # Wallet integration utilities
└── public/              # Static assets
```

## Key User Flows

1. **Content Creation**:

   - User connects wallet
   - Navigates to Create page
   - Enters text prompt and selects parameters
   - AI generates video
   - User publishes or mints as NFT

2. **Content Consumption**:

   - User browses video feed
   - Watches videos
   - Earns SOL tokens for engagement
   - Tokens are sent to connected wallet

3. **NFT Marketplace**:
   - Creator mints video as NFT
   - NFT is listed in marketplace
   - Buyers purchase with Sonic tokens
   - Ownership transfers on blockchain

## 💰 Tokenomics

- **SOL Token**: Native utility token on Sonic blockchain
- **Earning Mechanisms**:
  - Watching videos (0.01 SOL per minute)
  - Creating content (0.2 SOL per published video)
  - Community engagement (voting, commenting)
- **Spending Use Cases**:
  - Premium video generation features
  - NFT purchases
  - Campaign creation

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/blocktok-ai.git
cd blocktok-ai
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with your API keys:

```
NEXT_PUBLIC_VADOO_API_KEY=your_vadoo_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Troubleshooting

If you encounter Node.js dependency issues on macOS (e.g., missing libraries like `libicui18n.67.dylib`), you can use our helper script:

```bash
chmod +x run-dev.sh
./run-dev.sh
```

This script will install nvm, set up the correct Node.js version, and run the development server.

## Deployment

The app is optimized for deployment on Vercel, but can be deployed to any platform that supports Next.js applications.

## Future Roadmap

- **Enhanced AI Models**: Integration with more advanced video generation models
- **Real-time Collaboration**: Allow multiple creators to collaborate on videos
- **Advanced Analytics**: Detailed insights for creators about audience engagement
- **Multi-chain Support**: Expand beyond Sonic to other EVM-compatible chains
- **Mobile Apps**: Native mobile applications for iOS and Android

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgements

- [Sonic Protocol](https://sonic.com/) for blockchain infrastructure
- [Vadoo AI](https://vadoo.ai/) for video generation capabilities
- [Mixkit](https://mixkit.co/) for sample videos used in demonstration
