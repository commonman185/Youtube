import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateCommentReplies } from "@/lib/ai-utils";
import { getYouTubeChannelData, getVideoComments } from "@/lib/youtube-api";
import BaseLayout from "@/components/layout/base-layout";
import { GlassCard } from "@/components/ui/3d-animation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Search,
  MessageSquare,
  Filter,
  ThumbsUp,
  AlertCircle,
  Smile,
  Frown,
  Meh,
  Send,
  RefreshCw
} from "lucide-react";

interface Comment {
  id: string;
  authorName: string;
  authorProfileImageUrl: string;
  text: string;
  publishedAt: string;
  likeCount: number;
  videoId?: string;
  videoTitle?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  aiReplySuggestions?: string[];
  chosenReply?: string;
}

export default function AICommentAssistant() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<string>("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentimentStats, setSentimentStats] = useState({
    positive: 85,
    neutral: 12,
    negative: 3
  });
  
  // For demonstration, we're using a hardcoded userId
  // In a real application, this would come from an auth context
  const userId = 1;
  
  // Fetch channel data
  const { data: channelData, isLoading: isLoadingChannel } = useQuery({
    queryKey: ['/api/channels/user', userId],
    queryFn: () => getYouTubeChannelData(userId)
  });
  
  // Fetch comments for recent videos
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  
  // Fetch videos
  const [videos, setVideos] = useState<{ id: string; title: string }[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  
  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      if (!channelData?.id) return;
      
      setIsLoadingComments(true);
      try {
        setIsLoadingVideos(true);
        // Simulate fetching video list
        const videoList = [
          { id: 'video-1', title: 'How to Set Up Your YouTube Studio' },
          { id: 'video-2', title: 'Top 10 Tips for Growing Your Channel' },
          { id: 'video-3', title: 'Equipment Review: Best Microphones for YouTubers' },
          { id: 'video-4', title: 'Advanced Editing Techniques for YouTube' },
          { id: 'video-5', title: 'How I Reached 10,000 Subscribers' }
        ];
        setVideos(videoList);
        setIsLoadingVideos(false);
        
        // For each video, get comments
        const allComments: Comment[] = [];
        for (const video of videoList) {
          const videoComments = await getVideoComments(video.id);
          allComments.push(...videoComments.map(comment => ({
            ...comment,
            videoId: video.id,
            videoTitle: video.title,
            sentiment: getRandomSentiment()
          })));
        }
        
        // Sort by recent
        allComments.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        
        setComments(allComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast({
          title: "Failed to load comments",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive"
        });
      } finally {
        setIsLoadingComments(false);
      }
    };
    
    fetchComments();
  }, [channelData, toast]);
  
  // Filter comments based on search query, sentiment, and video
  const filteredComments = comments.filter(comment => {
    const matchesSearch = searchQuery === "" || 
      comment.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSentiment = selectedSentiment === "all" || comment.sentiment === selectedSentiment;
    
    const matchesVideo = selectedVideo === "all" || comment.videoId === selectedVideo;
    
    return matchesSearch && matchesSentiment && matchesVideo;
  });
  
  // Generate AI reply mutation
  const generateReplyMutation = useMutation({
    mutationFn: async (comment: Comment) => {
      setIsAnalyzing(true);
      
      try {
        const result = await generateCommentReplies(comment.text);
        
        // Update comment with AI suggestions
        const updatedComment = {
          ...comment,
          sentiment: result.sentiment as 'positive' | 'negative' | 'neutral',
          aiReplySuggestions: result.suggestions
        };
        
        // Update the comment in state
        setComments(prev => 
          prev.map(c => c.id === comment.id ? updatedComment : c)
        );
        
        // Save to backend
        await apiRequest('POST', '/api/comment-replies', {
          userId,
          videoId: comment.videoId || 'unknown',
          commentId: comment.id,
          commentText: comment.text,
          aiReplySuggestions: result.suggestions,
          sentiment: result.sentiment
        });
        
        return updatedComment;
      } finally {
        setIsAnalyzing(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Analysis complete",
        description: "AI reply suggestions have been generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to generate reply suggestions",
        variant: "destructive"
      });
    }
  });
  
  // Choose reply mutation
  const chooseReplyMutation = useMutation({
    mutationFn: async ({ commentId, reply }: { commentId: string, reply: string }) => {
      // Update comment with chosen reply
      setComments(prev => 
        prev.map(c => c.id === commentId ? { ...c, chosenReply: reply } : c)
      );
      
      // In a real app, this would update the backend and potentially post to YouTube API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulating API call
      
      return { commentId, reply };
    },
    onSuccess: () => {
      toast({
        title: "Reply selected",
        description: "Your reply has been saved and is ready to post.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to select reply",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Post reply mutation
  const postReplyMutation = useMutation({
    mutationFn: async ({ commentId, reply }: { commentId: string, reply: string }) => {
      // In a real app, this would post to YouTube API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      // Update comment to show it was replied to
      setComments(prev => 
        prev.map(c => c.id === commentId ? { ...c, chosenReply: undefined, isReplied: true } : c)
      );
      
      return { commentId, reply };
    },
    onSuccess: () => {
      toast({
        title: "Reply posted",
        description: "Your reply has been posted to YouTube.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to post reply",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Update sentiment stats based on filtered comments
  useEffect(() => {
    if (comments.length > 0) {
      const positiveCount = comments.filter(c => c.sentiment === 'positive').length;
      const neutralCount = comments.filter(c => c.sentiment === 'neutral').length;
      const negativeCount = comments.filter(c => c.sentiment === 'negative').length;
      
      const total = comments.length;
      setSentimentStats({
        positive: Math.round((positiveCount / total) * 100),
        neutral: Math.round((neutralCount / total) * 100),
        negative: Math.round((negativeCount / total) * 100)
      });
    }
  }, [comments]);
  
  // Helper functions
  function getRandomSentiment(): 'positive' | 'negative' | 'neutral' {
    const rand = Math.random();
    if (rand < 0.7) return 'positive';
    if (rand < 0.9) return 'neutral';
    return 'negative';
  }
  
  function getSentimentIcon(sentiment: string | undefined) {
    switch (sentiment) {
      case 'positive':
        return <Smile className="h-4 w-4 text-[#00C851]" />;
      case 'negative':
        return <Frown className="h-4 w-4 text-[#FF4444]" />;
      case 'neutral':
        return <Meh className="h-4 w-4 text-[#FFD700]" />;
      default:
        return null;
    }
  }
  
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }
  
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl font-bold mb-4">AI Comment Assistant</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Engage with your audience more efficiently using AI-powered comment analysis and response suggestions tailored to your style.
          </p>
        </div>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters & Stats */}
          <div className="lg:col-span-1">
            {/* Channel Info */}
            <GlassCard className="mb-8">
              {isLoadingChannel ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 text-[#FF1493] animate-spin" />
                </div>
              ) : channelData ? (
                <>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FF1493] to-[#8A2BE2] rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {channelData.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-semibold">{channelData.name}</h2>
                      <p className="text-sm text-gray-400">{channelData.subscriberCount.toLocaleString()} subscribers</p>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-dark bg-opacity-50 rounded-lg mb-4">
                    <p className="text-sm text-gray-400 mb-1">Total Comments Pending</p>
                    <p className="text-3xl font-semibold text-[#FF1493]">{comments.length}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-3">No YouTube channel linked</p>
                  <Button className="bg-gradient-to-r from-[#FF1493] to-[#8A2BE2]">
                    Link Your Channel
                  </Button>
                </div>
              )}
            </GlassCard>
            
            {/* Filters */}
            <GlassCard className="mb-8">
              <h2 className="font-orbitron text-xl font-semibold mb-6">Filter Comments</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search comments..." 
                      className="pl-9 bg-dark bg-opacity-50 border-gray-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Filter by Sentiment</label>
                  <Select 
                    value={selectedSentiment}
                    onValueChange={setSelectedSentiment}
                  >
                    <SelectTrigger className="bg-dark bg-opacity-50 border-gray-700">
                      <SelectValue placeholder="Select sentiment" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark border-gray-700">
                      <SelectItem value="all">All Comments</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Filter by Video</label>
                  <Select 
                    value={selectedVideo}
                    onValueChange={setSelectedVideo}
                  >
                    <SelectTrigger className="bg-dark bg-opacity-50 border-gray-700">
                      <SelectValue placeholder="Select video" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark border-gray-700">
                      <SelectItem value="all">All Videos</SelectItem>
                      {videos.map(video => (
                        <SelectItem key={video.id} value={video.id}>
                          {truncateText(video.title, 30)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>
            
            {/* Sentiment Analysis */}
            <GlassCard>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-orbitron text-xl font-semibold">Sentiment Analysis</h2>
                <RefreshCw className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white transition-colors" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-[#00C851] rounded-full mr-1"></span>
                      Positive
                    </span>
                    <span className="text-sm">{sentimentStats.positive}%</span>
                  </div>
                  <Progress value={sentimentStats.positive} className="h-2 bg-dark" indicatorClassName="bg-[#00C851]" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-[#FFD700] rounded-full mr-1"></span>
                      Neutral
                    </span>
                    <span className="text-sm">{sentimentStats.neutral}%</span>
                  </div>
                  <Progress value={sentimentStats.neutral} className="h-2 bg-dark" indicatorClassName="bg-[#FFD700]" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-[#FF4444] rounded-full mr-1"></span>
                      Negative
                    </span>
                    <span className="text-sm">{sentimentStats.negative}%</span>
                  </div>
                  <Progress value={sentimentStats.negative} className="h-2 bg-dark" indicatorClassName="bg-[#FF4444]" />
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Tips Based on Sentiment:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <Smile className="h-4 w-4 text-[#00C851] mt-0.5 flex-shrink-0" />
                    <span>Encourage positive commenters to subscribe and share</span>
                  </li>
                  <li className="flex gap-2">
                    <Meh className="h-4 w-4 text-[#FFD700] mt-0.5 flex-shrink-0" />
                    <span>Neutral comments are opportunities to build deeper connections</span>
                  </li>
                  <li className="flex gap-2">
                    <Frown className="h-4 w-4 text-[#FF4444] mt-0.5 flex-shrink-0" />
                    <span>Address negative comments promptly and professionally</span>
                  </li>
                </ul>
              </div>
            </GlassCard>
          </div>
          
          {/* Main Content Area - Comments */}
          <div className="lg:col-span-3">
            <GlassCard>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-orbitron text-xl font-semibold">Comment Management</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    Showing {filteredComments.length} of {comments.length} comments
                  </span>
                </div>
              </div>
              
              <Tabs defaultValue="pending">
                <TabsList className="bg-dark bg-opacity-50 mb-6">
                  <TabsTrigger value="pending">Pending Replies</TabsTrigger>
                  <TabsTrigger value="replied">Replied</TabsTrigger>
                  <TabsTrigger value="all">All Comments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending">
                  {isLoadingComments ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-8 w-8 text-[#FF1493] animate-spin" />
                    </div>
                  ) : filteredComments.filter(c => !c.isReplied).length > 0 ? (
                    <div className="space-y-6">
                      {filteredComments
                        .filter(c => !c.isReplied)
                        .map(comment => (
                          <CommentCard
                            key={comment.id}
                            comment={comment}
                            onAnalyze={() => generateReplyMutation.mutate(comment)}
                            onSelectReply={(reply) => chooseReplyMutation.mutate({ commentId: comment.id, reply })}
                            onPostReply={(reply) => postReplyMutation.mutate({ commentId: comment.id, reply })}
                            isAnalyzing={isAnalyzing && generateReplyMutation.isPending}
                            isSelectingReply={chooseReplyMutation.isPending}
                            isPostingReply={postReplyMutation.isPending}
                          />
                        ))
                      }
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No pending comments match your filters</p>
                      {selectedSentiment !== 'all' || selectedVideo !== 'all' || searchQuery !== '' ? (
                        <Button 
                          variant="link" 
                          className="text-[#FF1493] mt-2"
                          onClick={() => {
                            setSelectedSentiment('all');
                            setSelectedVideo('all');
                            setSearchQuery('');
                          }}
                        >
                          Clear filters
                        </Button>
                      ) : null}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="replied">
                  {isLoadingComments ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-8 w-8 text-[#FF1493] animate-spin" />
                    </div>
                  ) : filteredComments.filter(c => c.isReplied).length > 0 ? (
                    <div className="space-y-6">
                      {filteredComments
                        .filter(c => c.isReplied)
                        .map(comment => (
                          <div key={comment.id} className="p-4 bg-dark bg-opacity-50 rounded-lg">
                            <div className="flex items-start mb-3">
                              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xs mr-3">
                                {comment.authorName.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium flex items-center">
                                      {comment.authorName}
                                      {comment.sentiment && (
                                        <span className="ml-2">
                                          {getSentimentIcon(comment.sentiment)}
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {formatDate(comment.publishedAt)} • {comment.videoTitle}
                                    </p>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    <span>{comment.likeCount}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-300 mt-2">{comment.text}</p>
                                <div className="bg-[#1E1E1E] p-3 rounded mt-3 border-l-2 border-[#0CFFE1]">
                                  <p className="text-xs text-gray-400 mb-1">Your reply:</p>
                                  <p className="text-sm">Thank you for your comment! We appreciate your feedback.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No replied comments match your filters</p>
                      {selectedSentiment !== 'all' || selectedVideo !== 'all' || searchQuery !== '' ? (
                        <Button 
                          variant="link" 
                          className="text-[#FF1493] mt-2"
                          onClick={() => {
                            setSelectedSentiment('all');
                            setSelectedVideo('all');
                            setSearchQuery('');
                          }}
                        >
                          Clear filters
                        </Button>
                      ) : null}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="all">
                  {isLoadingComments ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-8 w-8 text-[#FF1493] animate-spin" />
                    </div>
                  ) : filteredComments.length > 0 ? (
                    <div className="space-y-6">
                      {filteredComments.map(comment => 
                        comment.isReplied ? (
                          <div key={comment.id} className="p-4 bg-dark bg-opacity-50 rounded-lg">
                            <div className="flex items-start mb-3">
                              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xs mr-3">
                                {comment.authorName.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium flex items-center">
                                      {comment.authorName}
                                      {comment.sentiment && (
                                        <span className="ml-2">
                                          {getSentimentIcon(comment.sentiment)}
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {formatDate(comment.publishedAt)} • {comment.videoTitle}
                                    </p>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    <span>{comment.likeCount}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-300 mt-2">{comment.text}</p>
                                <div className="bg-[#1E1E1E] p-3 rounded mt-3 border-l-2 border-[#0CFFE1]">
                                  <p className="text-xs text-gray-400 mb-1">Your reply:</p>
                                  <p className="text-sm">Thank you for your comment! We appreciate your feedback.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <CommentCard
                            key={comment.id}
                            comment={comment}
                            onAnalyze={() => generateReplyMutation.mutate(comment)}
                            onSelectReply={(reply) => chooseReplyMutation.mutate({ commentId: comment.id, reply })}
                            onPostReply={(reply) => postReplyMutation.mutate({ commentId: comment.id, reply })}
                            isAnalyzing={isAnalyzing && generateReplyMutation.isPending}
                            isSelectingReply={chooseReplyMutation.isPending}
                            isPostingReply={postReplyMutation.isPending}
                          />
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No comments match your filters</p>
                      {selectedSentiment !== 'all' || selectedVideo !== 'all' || searchQuery !== '' ? (
                        <Button 
                          variant="link" 
                          className="text-[#FF1493] mt-2"
                          onClick={() => {
                            setSelectedSentiment('all');
                            setSelectedVideo('all');
                            setSearchQuery('');
                          }}
                        >
                          Clear filters
                        </Button>
                      ) : null}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </GlassCard>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

interface CommentCardProps {
  comment: Comment;
  onAnalyze: () => void;
  onSelectReply: (reply: string) => void;
  onPostReply: (reply: string) => void;
  isAnalyzing: boolean;
  isSelectingReply: boolean;
  isPostingReply: boolean;n;
}

function CommentCard({
  comment,
  onAnalyze,
  onSelectReply,
  onPostReply,
  isAnalyzing,
  isSelectingReply,
  isPostingReply
}: CommentCardProps) {
  const [customReply, setCustomReply] = useState("");
  
  return (
    <div className="p-4 bg-dark bg-opacity-50 rounded-lg">
      <div className="flex items-start mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xs mr-3">
          {comment.authorName.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between">
            <div>
              <p className="font-medium flex items-center">
                {comment.authorName}
                {comment.sentiment && (
                  <span className="ml-2">
                    {getSentimentIcon(comment.sentiment)}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(comment.publishedAt)} • {comment.videoTitle}
              </p>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <ThumbsUp className="h-3 w-3 mr-1" />
              <span>{comment.likeCount}</span>
            </div>
          </div>
          <p className="text-sm text-gray-300 mt-2">{comment.text}</p>
        </div>
      </div>
      
      {comment.aiReplySuggestions ? (
        <>
          <div className="ml-13 pl-10">
            <p className="text-sm text-gray-300 mb-2">AI Response Suggestions:</p>
            <div className="space-y-2">
              {comment.aiReplySuggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className={`p-2 border ${
                    comment.chosenReply === suggestion 
                      ? 'border-[#FF1493]' 
                      : 'border-gray-700'
                  } rounded-lg text-sm hover:bg-[#FF1493] hover:bg-opacity-10 cursor-pointer transition-colors`}
                  onClick={() => onSelectReply(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-2">Or write a custom reply:</p>
              <div className="flex gap-2">
                <Textarea
                  className="bg-dark bg-opacity-50 border-gray-700 min-h-[80px]"
                  placeholder="Type your custom reply here..."
                  value={customReply}
                  onChange={(e) => setCustomReply(e.target.value)}
                />
                <Button 
                  className="bg-[#FF1493] hover:bg-opacity-90 self-end"
                  onClick={() => onSelectReply(customReply)}
                  disabled={customReply.trim() === "" || isSelectingReply}
                >
                  {isSelectingReply ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {comment.chosenReply && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Selected Reply:</p>
                  <Button 
                    className="bg-gradient-to-r from-[#FF1493] to-[#8A2BE2] hover:opacity-90 h-8"
                    onClick={() => onPostReply(comment.chosenReply!)}
                    disabled={isPostingReply}
                  >
                    {isPostingReply ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Posting...
                      </>
                    ) : (
                      <>Post Reply</>
                    )}
                  </Button>
                </div>
                <div className="p-3 bg-[#1E1E1E] rounded border-l-2 border-[#FF1493]">
                  {comment.chosenReply}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="ml-13 pl-10 text-center py-3">
          <Button
            className="bg-gradient-to-r from-[#FF1493] to-[#8A2BE2] hover:opacity-90"
            onClick={onAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyzing Comment...
              </>
            ) : (
              <>Analyze & Generate Replies</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
