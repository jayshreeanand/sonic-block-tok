# BlockTok AI

BlockTok AI is an AI-powered short-form video generation platform on the Injective blockchain that revolutionizes user engagement by tokenizing attention. Users earn rewards for watching, sharing, and interacting with AI-generated content, while creators can monetize their content through onchain ad revenue, NFTs, and decentralized marketing campaigns.

## 🚀 Features

- **AI Video Generation**: Create AI-generated short-form videos with customizable options
  - **Text-to-Video**: Generate videos from text descriptions using Vadoo AI
  - **Style Presets**: Apply different artistic styles to generated videos
  - **Video Templates**: Use pre-made templates for quick creation
- **Token Rewards**: Earn BTOK tokens for watching, sharing, and interacting with content
- **NFT Marketplace**: Mint videos as NFTs on the Injective blockchain
- **Creator Economy**: Monetize content through various revenue streams
- **Campaign Marketplace**: Create marketing campaigns to promote content
- **Wallet Integration**: Connect your Injective wallet to manage tokens and NFTs

## 🔧 Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Blockchain**: Injective Protocol, Injective SDK
- **AI**: Integration with AI video generation models
  - Vadoo AI API for text-to-video generation
  - Support for custom style presets and video templates
- **Authentication**: Wallet authentication

## 🎬 AI Video Generation

BlockTok AI uses the Vadoo AI API to generate high-quality videos from text prompts. The platform allows creators to:

1. Write detailed prompts describing the desired video
2. Select voice, duration, and style preferences
3. Generate professional-looking videos in minutes
4. Mint these videos as NFTs or publish them to the feed

To use the video generation feature:

- Navigate to the Create page
- Enter a detailed description of your desired video
- Choose your preferred settings
- Click "Generate Video"
- Once completed, you can download, mint as NFT, or publish directly

## 🔒 API Keys

To use the video generation feature, you need to set up the following environment variables:

```
VADOO_API_KEY=your_vadoo_api_key_here
```

You can add these to a `.env.local` file in the root of the project.

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/             # API routes including Vadoo webhook
│   ├── create/          # Video creation page
│   └── ...              # Other app pages
├── components/          # React components
│   ├── layout/          # Layout components
│   ├── ui/              # UI components
│   └── video/           # Video-related components
├── lib/                 # Utility functions and types
│   ├── mock-data.ts     # Mock data for development
│   ├── textToVideoApi.ts # Vadoo API integration
│   ├── types.ts         # TypeScript type definitions
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## 📋 Key Pages

- **Home**: Featured videos and content discovery
- **Discover**: Explore videos by category
- **Video Details**: Watch videos and earn tokens
- **Create**: Generate AI videos
- **Profile**: User profiles and stats
- **Wallet**: Manage BTOK tokens and transactions

## 🧠 Tokenomics

- **BTOK Token**: Native utility token on the Injective blockchain
- **Earning Mechanisms**: Watch videos, create content, engage with community
- **Spending Mechanisms**: Create AI videos, purchase NFTs, launch campaigns

## 📱 Mobile-First Design

BlockTok AI features a responsive, mobile-first design to ensure optimal user experience across all devices, similar to popular short-form video platforms.

## 🔒 Security

- Secure wallet connections
- On-chain transactions for transparency
- NFT ownership verification

## 🚀 Getting Started

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
VADOO_API_KEY=your_vadoo_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

The app can be deployed to various platforms like Vercel, Netlify, or traditional hosting.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
