import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import BaseLayout from "@/components/layout/base-layout";
import { GlassCard, StatsAnimation } from "@/components/ui/3d-animation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getYouTubeChannelData, getRecentVideos } from "@/lib/youtube-api";
import { formatNumber } from "@/lib/utils";
import { Loader2, TrendingUp, Award, PlayCircle, ThumbsUp, MessageCircle, Clock } from "lucide-react";

export default function Dashboard() {
  // In a real app, we would get this from an auth context
  const userId = 1;
  
  const { data: channelData, isLoading: isLoadingChannel } = useQuery({
    queryKey: ['/api/channels/user', userId],
    queryFn: () => getYouTubeChannelData(userId)
  });
  
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  
  useEffect(() => {
    const fetchRecentVideos = async () => {
      if (channelData?.id) {
        setIsLoadingVideos(true);
        try {
          const videos = await getRecentVideos(channelData.id);
          setRecentVideos(videos);
        } catch (error) {
          console.error("Error fetching videos:", error);
        } finally {
          setIsLoadingVideos(false);
        }
      }
    };
    
    fetchRecentVideos();
  }, [channelData]);
  
  const statsData = channelData ? [
    { label: "Subscribers", value: channelData.subscriberCount || 0 },
    { label: "Videos", value: channelData.videoCount || 0 },
    { label: "Views", value: channelData.viewCount || 0 }
  ] : [];
  
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Channel Overview */}
          <div className="w-full md:w-1/3">
            <GlassCard className="mb-6">
              <h2 className="font-orbitron text-xl font-bold mb-6">Channel Overview</h2>
              
              {isLoadingChannel ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : channelData ? (
                <>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xl font-bold mr-4">
                      {channelData.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{channelData.name}</h3>
                      <p className="text-gray-400 text-sm">
                        Last updated: {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">{formatNumber(channelData.subscriberCount)}</p>
                      <p className="text-gray-400 text-sm">Subscribers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-secondary">{formatNumber(channelData.videoCount)}</p>
                      <p className="text-gray-400 text-sm">Videos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-accent">{formatNumber(channelData.viewCount)}</p>
                      <p className="text-gray-400 text-sm">Views</p>
                    </div>
                  </div>
                  
                  <div className="h-56">
                    <StatsAnimation data={statsData} height="h-56" />
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-400 mb-4">No YouTube channel linked yet</p>
                  <Link href="/profile">
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      Link Your Channel
                    </Button>
                  </Link>
                </div>
              )}
            </GlassCard>
            
            <GlassCard className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-orbitron text-lg font-semibold">Growth Opportunities</h3>
                <span className="bg-primary bg-opacity-20 text-primary px-3 py-1 rounded-full text-xs">5 NEW</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3 p-3 bg-dark bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Optimize your thumbnails</p>
                    <p className="text-xs text-gray-400">Increasing CTR by 2% could gain you 500+ views</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-dark bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                  <Award className="h-5 w-5 text-secondary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Respond to more comments</p>
                    <p className="text-xs text-gray-400">Channels with high engagement grow 3x faster</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-dark bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                  <Clock className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Post more consistently</p>
                    <p className="text-xs text-gray-400">Try uploading weekly for better growth</p>
                  </div>
                </div>
              </div>
              
              <Link href="/optimization-tips">
                <Button className="w-full mt-4 border border-primary text-primary hover:bg-primary hover:bg-opacity-10">
                  See All Opportunities
                </Button>
              </Link>
            </GlassCard>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="w-full mb-6 bg-dark bg-opacity-50">
                <TabsTrigger value="videos" className="flex-1">Recent Videos</TabsTrigger>
                <TabsTrigger value="content" className="flex-1">Content Ideas</TabsTrigger>
                <TabsTrigger value="tasks" className="flex-1">Optimization Tasks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="videos">
                <GlassCard>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-orbitron text-lg font-semibold">Recent Videos Performance</h3>
                    <Button variant="outline" className="text-sm h-8 border-primary text-primary">
                      Refresh Data
                    </Button>
                  </div>
                  
                  {isLoadingVideos ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  ) : recentVideos.length > 0 ? (
                    <div className="space-y-4">
                      {recentVideos.map((video, index) => (
                        <div key={index} className="p-4 bg-dark bg-opacity-50 rounded-lg">
                          <div className="flex gap-4">
                            <div className="w-32 h-18 rounded bg-gray-800 flex-shrink-0 flex items-center justify-center">
                              <PlayCircle className="h-8 w-8 text-gray-600" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium mb-1">{video.title}</h4>
                              <p className="text-xs text-gray-400 mb-2">
                                {new Date(video.publishedAt).toLocaleDateString()}
                              </p>
                              <div className="flex gap-4 text-xs text-gray-300">
                                <span className="flex items-center gap-1">
                                  <PlayCircle className="h-3 w-3" /> {formatNumber(video.viewCount)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" /> {formatNumber(video.likeCount)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" /> {formatNumber(video.commentCount)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-gray-400">No videos found for this channel</p>
                    </div>
                  )}
                </GlassCard>
              </TabsContent>
              
              <TabsContent value="content">
                <GlassCard>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-orbitron text-lg font-semibold">Suggested Content Ideas</h3>
                    <Link href="/content-suggestions">
                      <Button className="text-sm h-8 bg-gradient-to-r from-primary to-secondary">
                        Generate More
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-dark bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Day in the Life of a Content Creator</h4>
                        <button className="text-primary hover:text-white transition-colors">
                          <i className="fas fa-bookmark"></i>
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">Show your audience behind-the-scenes of your content creation process, from planning to editing.</p>
                      <div className="flex mt-3 gap-2">
                        <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">Vlog</span>
                        <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">BTS</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-dark bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Top 5 Editing Tips to Save Time</h4>
                        <button className="text-primary hover:text-white transition-colors">
                          <i className="fas fa-bookmark"></i>
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">Share your best video editing shortcuts and techniques that have helped improve your workflow.</p>
                      <div className="flex mt-3 gap-2">
                        <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">Tutorial</span>
                        <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">Editing</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </TabsContent>
              
              <TabsContent value="tasks">
                <GlassCard>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-orbitron text-lg font-semibold">Optimization Tasks</h3>
                    <Link href="/optimization-tips">
                      <Button className="text-sm h-8 bg-secondary bg-opacity-20 text-secondary">
                        View All Tasks
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-3 h-4 w-4" style={{ accentColor: "#8A2BE2" }} />
                      <div>
                        <p className="font-medium">Update channel banner with new branding</p>
                        <p className="text-sm text-gray-400">A consistent brand image helps viewers recognize your content.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-3 h-4 w-4" style={{ accentColor: "#8A2BE2" }} />
                      <div>
                        <p className="font-medium">Add end screens to last 5 videos</p>
                        <p className="text-sm text-gray-400">End screens can increase watch time by directing viewers to more of your content.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <input type="checkbox" className="mt-1 mr-3 h-4 w-4" style={{ accentColor: "#8A2BE2" }} checked readOnly />
                      <div>
                        <p className="font-medium line-through">Set up channel keywords</p>
                        <p className="text-sm text-gray-400 line-through">Channel keywords help YouTube understand what your content is about.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-semibold text-secondary">33%</span>
                        <span className="text-gray-400 text-sm ml-2">Completed</span>
                      </div>
                    </div>
                    <div className="w-full bg-dark h-2 rounded-full mt-2">
                      <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{ width: "33%" }}></div>
                    </div>
                  </div>
                </GlassCard>
              </TabsContent>
            </Tabs>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <GlassCard className="h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-orbitron text-lg font-semibold">Comment Management</h3>
                  <span className="bg-accent bg-opacity-20 text-accent px-3 py-1 rounded-full text-xs">8 NEW</span>
                </div>
                
                <div className="p-4 bg-dark bg-opacity-50 rounded-lg mb-4">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xs mr-3">
                      MJ
                    </div>
                    <div>
                      <p className="font-medium mb-1">Mike Johnson</p>
                      <p className="text-sm text-gray-400">This video changed how I approach my channel strategy!</p>
                    </div>
                  </div>
                </div>
                
                <Link href="/ai-comment-assistant">
                  <Button className="w-full bg-gradient-to-r from-accent to-secondary hover:opacity-90">
                    Respond with AI Assistant
                  </Button>
                </Link>
              </GlassCard>
              
              <GlassCard className="h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-orbitron text-lg font-semibold">Quick Actions</h3>
                </div>
                
                <div className="space-y-3">
                  <Link href="/content-suggestions">
                    <Button className="w-full justify-start bg-dark bg-opacity-50 hover:bg-opacity-70 text-left h-auto py-3">
                      <i className="fas fa-lightbulb text-primary mr-3"></i>
                      Generate Content Ideas
                    </Button>
                  </Link>
                  
                  <Link href="/optimization-tips">
                    <Button className="w-full justify-start bg-dark bg-opacity-50 hover:bg-opacity-70 text-left h-auto py-3">
                      <i className="fas fa-chart-line text-secondary mr-3"></i>
                      Optimize Channel Growth
                    </Button>
                  </Link>
                  
                  <Link href="/engagement-strategies">
                    <Button className="w-full justify-start bg-dark bg-opacity-50 hover:bg-opacity-70 text-left h-auto py-3">
                      <i className="fas fa-users text-accent mr-3"></i>
                      Boost Audience Engagement
                    </Button>
                  </Link>
                  
                  <Link href="/profile">
                    <Button className="w-full justify-start bg-dark bg-opacity-50 hover:bg-opacity-70 text-left h-auto py-3">
                      <i className="fas fa-cog text-gray-400 mr-3"></i>
                      Manage Channel Settings
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
