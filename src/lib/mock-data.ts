import { User, Video, Comment, Category, Notification, Campaign, TokenTransaction } from "./types";
import { getRandomInt } from "./utils";

// Mock users
export const users: User[] = [
  {
    id: "1",
    username: "aiartist",
    displayName: "AI Artist",
    avatar: "/avatars/avatar1.png",
    walletAddress: "inj1qr8ysyyjahm75ks9f0hk0lvlp3zxhy4tv0t0qj",
    bio: "Creating AI-powered visual experiences on the blockchain",
    followers: 12500,
    following: 345,
    tokensEarned: 15800,
    createdAt: "2023-10-15T10:30:00Z",
  },
  {
    id: "2",
    username: "tech_visionary",
    displayName: "Tech Visionary",
    avatar: "/avatars/avatar2.png",
    walletAddress: "inj1xpj07h9nxc0jw6m3lj0c7md0rqqj4ztfw9hv2h",
    bio: "Exploring the intersection of AI and blockchain",
    followers: 8700,
    following: 215,
    tokensEarned: 9200,
    createdAt: "2023-09-05T14:20:00Z",
  },
  {
    id: "3",
    username: "crypto_dreamer",
    displayName: "Crypto Dreamer",
    avatar: "/avatars/avatar3.png",
    walletAddress: "inj1ra7v897zaepgr5vr5g5zy2wxs5x8wyvkw3l0z0",
    bio: "Building the decentralized future, one token at a time",
    followers: 5400,
    following: 178,
    tokensEarned: 6800,
    createdAt: "2023-11-20T09:15:00Z",
  },
];

// Mock categories
export const categories: Category[] = [
  { id: "1", name: "AI Art", icon: "paintbrush" },
  { id: "2", name: "Tech", icon: "cpu" },
  { id: "3", name: "Crypto", icon: "bitcoin" },
  { id: "4", name: "Music", icon: "music" },
  { id: "5", name: "Fashion", icon: "shirt" },
  { id: "6", name: "Gaming", icon: "gamepad" },
  { id: "7", name: "Education", icon: "graduation-cap" },
  { id: "8", name: "Comedy", icon: "smile" },
];

// Use fixed seeds for video IDs to avoid hydration errors
const FIXED_SEEDS = {
  videoIds: [5, 12, 8, 19, 3, 10, 7, 15, 2, 11, 6, 14, 9, 4, 13, 17, 1],
  durations: [45, 30, 62, 18, 90, 25, 55, 33, 75, 42, 22, 68, 37, 51, 28, 60, 40],
  likes: [5621, 3210, 4890, 7500, 1250, 8900, 3400, 6750, 2100, 9500, 4200, 6300, 2800, 5100, 7200, 8400, 1800],
  shares: [1205, 890, 1420, 750, 230, 1800, 560, 980, 410, 1650, 720, 1380, 340, 920, 1520, 680, 280],
  views: [78500, 45200, 62700, 98000, 15400, 112000, 31500, 85300, 22700, 103500, 56800, 78900, 35200, 67400, 92800, 41600, 18900],
  tokens: [2450, 1680, 2100, 3100, 980, 3800, 1450, 2680, 1250, 3400, 1950, 2800, 1350, 2250, 3200, 1750, 1050]
};

// Generate more videos with deterministic values
export const videos: Video[] = [
  // First 3 are your original hand-crafted videos
  {
    id: "1",
    title: "AI Generated Symphony",
    description: "A beautiful symphony composed entirely by AI and visualized",
    url: "/videos/video1.mp4",
    thumbnail: "/thumbnails/thumbnail1.jpg",
    creator: users[0],
    likes: 5621,
    comments: 421,
    shares: 1205,
    views: 78500,
    tokens: 2450,
    categories: ["AI Art", "Music"],
    createdAt: "2024-03-10T16:45:00Z",
    duration: 45,
    isNFT: true,
    nftPrice: 0.5,
  },
  {
    id: "2",
    title: "Future of Blockchain",
    description: "Exploring how blockchain will transform digital ownership",
    url: "/videos/video2.mp4",
    thumbnail: "/thumbnails/thumbnail2.jpg",
    creator: users[1],
    likes: 3210,
    comments: 287,
    shares: 890,
    views: 45200,
    tokens: 1680,
    categories: ["Crypto", "Tech", "Education"],
    createdAt: "2024-03-08T12:30:00Z",
    duration: 60,
    isNFT: false,
  },
  {
    id: "3",
    title: "Digital Fashion Show",
    description: "The first-ever fully AI-generated fashion collection",
    url: "/videos/video3.mp4",
    thumbnail: "/thumbnails/thumbnail3.jpg",
    creator: users[2],
    likes: 4890,
    comments: 356,
    shares: 1420,
    views: 62700,
    tokens: 2100,
    categories: ["AI Art", "Fashion"],
    createdAt: "2024-03-05T09:20:00Z",
    duration: 75,
    isNFT: true,
    nftPrice: 0.3,
  },
];

// Add the remaining 17 videos with deterministic values
for (let i = 0; i < FIXED_SEEDS.videoIds.length; i++) {
  const videoId = (i + 4).toString(); // Start from 4 since we already have 3
  const seedIndex = i % FIXED_SEEDS.videoIds.length;
  const randomUserIndex = seedIndex % users.length;
  
  // Assign 1-3 categories deterministically
  const categoryCount = (seedIndex % 3) + 1;
  const categoryIndices = [];
  for (let j = 0; j < categoryCount; j++) {
    categoryIndices.push((seedIndex + j) % categories.length);
  }
  const videoCategories = categoryIndices.map(index => categories[index].name);
  
  // Deterministic date in the past month
  const daysAgo = (seedIndex % 30) + 1;
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);
  
  // Deterministic boolean based on seedIndex
  const isNFT = seedIndex % 3 === 0;
  
  videos.push({
    id: videoId,
    title: `AI BlockTok Video ${videoId}`,
    description: `This is an AI-generated video #${videoId}`,
    url: `/videos/video${videoId}.mp4`,
    thumbnail: `/thumbnails/thumbnail${videoId}.jpg`,
    creator: users[randomUserIndex],
    likes: FIXED_SEEDS.likes[seedIndex],
    comments: Math.floor(FIXED_SEEDS.likes[seedIndex] / 10),
    shares: FIXED_SEEDS.shares[seedIndex],
    views: FIXED_SEEDS.views[seedIndex],
    tokens: FIXED_SEEDS.tokens[seedIndex],
    categories: videoCategories,
    createdAt: createdDate.toISOString(),
    duration: FIXED_SEEDS.durations[seedIndex],
    isNFT: isNFT,
    nftPrice: isNFT ? Number((0.2 + seedIndex * 0.1).toFixed(2)) : undefined,
  });
}

// Mock comments
export const comments: Comment[] = [
  {
    id: "1",
    content: "This AI-generated content is mind-blowing!",
    user: users[1],
    likes: 152,
    createdAt: "2024-03-11T10:15:00Z",
    replies: [
      {
        id: "1-1",
        content: "Totally agree! The future is here.",
        user: users[2],
        likes: 45,
        createdAt: "2024-03-11T11:20:00Z",
      },
    ],
  },
  {
    id: "2",
    content: "How do I earn tokens by watching these videos?",
    user: users[2],
    likes: 89,
    createdAt: "2024-03-10T14:30:00Z",
    replies: [
      {
        id: "2-1",
        content: "Just connect your wallet and start watching. You'll earn BTOK tokens for each video!",
        user: users[0],
        likes: 67,
        createdAt: "2024-03-10T15:05:00Z",
      },
    ],
  },
];

// Mock campaigns
export const campaigns: Campaign[] = [
  {
    id: "1",
    title: "AI Art Promotion",
    description: "Boost visibility for AI-generated artworks",
    budget: 10000,
    tokensPerView: 2,
    targetViews: 50000,
    currentViews: 25678,
    status: "active",
    createdAt: "2024-03-01T09:00:00Z",
    endDate: "2024-04-01T09:00:00Z",
    creator: users[0],
    categories: ["AI Art"],
  },
  {
    id: "2",
    title: "Crypto Education Series",
    description: "Promote educational content about cryptocurrency",
    budget: 15000,
    tokensPerView: 3,
    targetViews: 100000,
    currentViews: 42390,
    status: "active",
    createdAt: "2024-02-15T14:30:00Z",
    endDate: "2024-03-30T14:30:00Z",
    creator: users[1],
    categories: ["Crypto", "Education"],
  },
];

// Mock token transactions
export const transactions: TokenTransaction[] = [
  {
    id: "1",
    type: "earn",
    amount: 45,
    timestamp: "2024-03-11T08:25:00Z",
    video: videos[0],
  },
  {
    id: "2",
    type: "transfer",
    amount: 100,
    timestamp: "2024-03-10T16:40:00Z",
    from: users[1],
    to: users[0],
  },
  {
    id: "3",
    type: "spend",
    amount: 200,
    timestamp: "2024-03-09T12:15:00Z",
    campaign: campaigns[0],
  },
];

// Mock notifications
export const notifications: Notification[] = [
  {
    id: "1",
    type: "like",
    content: "Tech Visionary liked your video",
    isRead: false,
    createdAt: "2024-03-11T14:30:00Z",
    user: users[1],
    video: videos[0],
  },
  {
    id: "2",
    type: "comment",
    content: "Crypto Dreamer commented on your video",
    isRead: true,
    createdAt: "2024-03-10T09:45:00Z",
    user: users[2],
    video: videos[0],
  },
  {
    id: "3",
    type: "token",
    content: "You earned 45 BTOK tokens from views",
    isRead: false,
    createdAt: "2024-03-11T08:25:00Z",
  },
  {
    id: "4",
    type: "nft",
    content: "Someone purchased your NFT video",
    isRead: false,
    createdAt: "2024-03-11T11:10:00Z",
    video: videos[0],
  },
]; 