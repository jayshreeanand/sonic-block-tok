export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  walletAddress: string;
  bio?: string;
  followers: number;
  following: number;
  tokensEarned: number;
  createdAt: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail: string;
  creator: User;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  tokens: number;
  categories: string[];
  createdAt: string;
  duration: number;
  isNFT: boolean;
  nftPrice?: number;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  likes: number;
  createdAt: string;
  replies?: Comment[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'token' | 'nft';
  content: string;
  isRead: boolean;
  createdAt: string;
  user?: User;
  video?: Video;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  budget: number;
  tokensPerView: number;
  targetViews: number;
  currentViews: number;
  status: 'active' | 'completed' | 'draft';
  createdAt: string;
  endDate: string;
  creator: User;
  categories: string[];
}

export interface TokenTransaction {
  id: string;
  type: 'earn' | 'spend' | 'transfer';
  amount: number;
  timestamp: string;
  from?: User;
  to?: User;
  video?: Video;
  campaign?: Campaign;
} 