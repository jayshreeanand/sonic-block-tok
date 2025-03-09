"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { VideoFeed } from "@/components/video/VideoFeed";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { users, videos, transactions } from "@/lib/mock-data";
import { formatAddress, formatNumber } from "@/lib/utils";
import { 
  Coins, 
  User, 
  Calendar, 
  Clock, 
  Edit,
  LinkIcon,
  BarChart,
  MessageSquare,
  Heart,
  Wallet
} from "lucide-react";

export default function ProfilePage() {
  // Using first user as the current user profile
  const user = users[0];
  
  // Get videos created by this user
  const userVideos = videos.filter(v => v.creator.id === user.id);
  
  // Recent transactions for this user
  const userTransactions = transactions.slice(0, 5);

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="relative mb-20 h-40 w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 sm:h-60">
            {/* Profile Avatar */}
            <div className="absolute -bottom-16 left-6 flex items-end">
              <Avatar 
                src={user.avatar} 
                alt={user.displayName} 
                fallback={user.displayName}
                size="lg" 
                className="h-32 w-32 border-4 border-background"
              />
            </div>
            
            {/* Edit Button */}
            <div className="absolute right-4 top-4">
              <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm">
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col justify-between sm:flex-row">
            <div>
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
              
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" />
                <span>{formatAddress(user.walletAddress)}</span>
                <button className="text-primary hover:underline">Copy</button>
              </div>
              
              {user.bio && (
                <p className="mt-3 max-w-2xl">{user.bio}</p>
              )}
              
              <div className="mt-4 flex flex-wrap gap-6">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">
                    {formatNumber(user.tokensEarned)} BTOK earned
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap items-center gap-4 sm:mt-0">
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold">{formatNumber(user.followers)}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-bold">{formatNumber(user.following)}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-bold">{formatNumber(userVideos.length)}</p>
                  <p className="text-sm text-muted-foreground">Videos</p>
                </div>
              </div>
              
              <Button variant="primary">
                Follow
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content Tabs and Profile Data */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Content Display Area */}
          <div className="md:col-span-2">
            <div className="mb-6 border-b">
              <div className="flex gap-1">
                <button className="border-b-2 border-primary px-4 py-2 font-medium text-primary">
                  Videos
                </button>
                <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
                  NFTs
                </button>
                <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
                  Liked
                </button>
              </div>
            </div>
            
            {/* Videos Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {userVideos.map(video => (
                <div key={video.id}>
                  <VideoFeed videos={[video]} limit={1} />
                </div>
              ))}
            </div>
            
            {userVideos.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-accent p-3">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-bold">No videos yet</h3>
                <p className="text-muted-foreground">
                  {user.displayName} hasn&apos;t uploaded any videos yet
                </p>
                <Button variant="primary" className="mt-4">
                  Create New Video
                </Button>
              </div>
            )}
          </div>
          
          {/* Sidebar with Stats and Info */}
          <div className="space-y-6">
            {/* Token Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold">Token Balance</h3>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    View All
                  </Button>
                </div>
                
                <div className="mb-4 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Coins className="h-5 w-5 text-amber-500" />
                    <span className="font-bold">BTOK</span>
                  </div>
                  <div className="mb-1 text-2xl font-bold">{user.tokensEarned}</div>
                  <div className="text-sm text-muted-foreground">
                    ≈ ${(user.tokensEarned * 0.05).toFixed(2)} USD
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Earned today:</span>
                    <span className="font-medium">+125 BTOK</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Earned this week:</span>
                    <span className="font-medium">+842 BTOK</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Transactions */}
            <Card>
              <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold">Recent Activity</h3>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    View All
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {userTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full p-2 ${
                          tx.type === 'earn' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                            : tx.type === 'spend'
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {tx.type === 'earn' ? (
                            <Coins className="h-4 w-4" />
                          ) : tx.type === 'spend' ? (
                            <BarChart className="h-4 w-4" />
                          ) : (
                            <LinkIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {tx.type === 'earn' 
                              ? 'Earned tokens' 
                              : tx.type === 'spend'
                              ? 'Campaign investment'
                              : 'Sent tokens'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-right ${
                        tx.type === 'earn' 
                          ? 'text-green-600 dark:text-green-400' 
                          : tx.type === 'spend'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        <p className="font-bold">
                          {tx.type === 'earn' ? '+' : tx.type === 'spend' ? '-' : ''}
                          {tx.amount} BTOK
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Overview */}
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-4 font-bold">Engagement Stats</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Total Likes</span>
                    </div>
                    <span className="font-medium">
                      {formatNumber(userVideos.reduce((sum, video) => sum + video.likes, 0))}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Total Comments</span>
                    </div>
                    <span className="font-medium">
                      {formatNumber(userVideos.reduce((sum, video) => sum + video.comments, 0))}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Total Views</span>
                    </div>
                    <span className="font-medium">
                      {formatNumber(userVideos.reduce((sum, video) => sum + video.views, 0))}
                    </span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>View Full Analytics</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 