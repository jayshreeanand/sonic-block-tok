"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoCard } from "@/components/video/VideoCard";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { videos, comments as mockComments } from "@/lib/mock-data";
import { formatNumber, formatAddress } from "@/lib/utils";
import { Coins, Calendar, MessageCircle, Share2, Heart, Bookmark, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface VideoPageProps {
  params: {
    id: string;
  };
}

export default function VideoPage({ params }: VideoPageProps) {
  const { id } = params;
  
  // Find the video by id
  const video = videos.find(v => v.id === id) || videos[0];
  
  // Get comments for this video
  const comments = mockComments;
  
  // Related videos (same category)
  const relatedVideos = videos
    .filter(v => v.id !== video.id && v.categories.some(cat => video.categories.includes(cat)))
    .slice(0, 6);

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Video Player and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="rounded-lg overflow-hidden">
              <VideoPlayer video={video} />
            </div>
            
            {/* Video Info */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>{formatNumber(video.likes)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-5 w-5" />
                    <span>{formatNumber(video.comments)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-5 w-5" />
                    <span>{formatNumber(video.shares)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Coins className="h-5 w-5" />
                    <span>{formatNumber(video.tokens)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="mr-1 h-4 w-4" />
                    <span>Like</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-1 h-4 w-4" />
                    <span>Share</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="mr-1 h-4 w-4" />
                    <span>Save</span>
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <Link href={`/profile/${video.creator.username}`} className="flex items-center gap-3">
                      <Avatar 
                        src={video.creator.avatar} 
                        alt={video.creator.displayName}
                        size="md"
                        fallback={video.creator.displayName}
                      />
                      <div>
                        <h3 className="font-bold">{video.creator.displayName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatAddress(video.creator.walletAddress)}
                        </p>
                      </div>
                    </Link>
                    
                    <Button variant="primary" size="sm">
                      Follow
                    </Button>
                  </div>
                  
                  {video.description && (
                    <p className="mb-3">{video.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {video.categories.map((category) => (
                      <Link
                        key={category}
                        href={`/discover?category=${category}`}
                        className="rounded-full bg-accent px-3 py-1 text-sm"
                      >
                        #{category.toLowerCase().replace(/\s+/g, '')}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>
                      {new Date(video.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              {/* NFT Purchase Section */}
              {video.isNFT && (
                <Card className="mt-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-900">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold mb-1">Exclusive NFT Content</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Own this AI-generated video as an NFT on Sonic blockchain
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xl">{video.nftPrice} SOL</span>
                          <span className="text-sm text-muted-foreground">
                            (~${(video.nftPrice || 0) * 25}.00)
                          </span>
                        </div>
                      </div>
                      
                      <Button variant="primary" size="lg">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        <span>Buy NFT</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Comments Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Comments</h3>
                  <span className="text-sm text-muted-foreground">{comments.length} comments</span>
                </div>
                
                <div className="flex gap-3 mb-6">
                  <Avatar fallback="You" size="sm" />
                  <div className="flex-1">
                    <input 
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full rounded-full border border-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar 
                        src={comment.user.avatar} 
                        alt={comment.user.displayName}
                        size="sm"
                        fallback={comment.user.displayName}
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.user.displayName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <button className="text-xs text-muted-foreground hover:text-foreground">
                            <Heart className="inline mr-1 h-3 w-3" />
                            {comment.likes}
                          </button>
                          <button className="text-xs text-muted-foreground hover:text-foreground">
                            Reply
                          </button>
                        </div>
                        
                        {/* Comment Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-6 mt-3 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar 
                                  src={reply.user.avatar} 
                                  alt={reply.user.displayName}
                                  size="sm"
                                  fallback={reply.user.displayName}
                                />
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{reply.user.displayName}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(reply.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm">{reply.content}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <button className="text-xs text-muted-foreground hover:text-foreground">
                                      <Heart className="inline mr-1 h-3 w-3" />
                                      {reply.likes}
                                    </button>
                                    <button className="text-xs text-muted-foreground hover:text-foreground">
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Videos */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Related Videos</h3>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <div key={relatedVideo.id} className="w-full">
                  <VideoCard video={relatedVideo} />
                </div>
              ))}
            </div>
            
            {/* Token Earning Card */}
            <Card className="bg-gradient-to-r from-amber-400/10 to-orange-500/10 border-amber-200 dark:border-amber-900 mt-4">
              <CardContent className="p-4">
                <h3 className="font-bold flex items-center mb-2">
                  <Coins className="mr-2 h-5 w-5 text-amber-500" />
                  <span>Earn Tokens</span>
                </h3>
                <p className="text-sm mb-3">
                  You can earn BTOK tokens by watching videos, creating content, and interacting with the community.
                </p>
                <Button variant="token" className="w-full">
                  <Coins className="mr-2 h-4 w-4" />
                  <span>Start Earning</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 