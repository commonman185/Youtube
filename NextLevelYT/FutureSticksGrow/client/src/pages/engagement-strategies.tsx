import { useState } from "react";
import BaseLayout from "@/components/layout/base-layout";
import { GlassCard } from "@/components/ui/3d-animation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { engagementStrategies } from "@/lib/ai-utils";
import { 
  MessageSquare, Users, Video, Share2, BarChart4, 
  Youtube, Twitter, Instagram, Facebook, TrendingUp, 
  Award, Calendar, Rocket
} from "lucide-react";

export default function EngagementStrategies() {
  const [activeTab, setActiveTab] = useState("comments");
  
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl font-bold mb-4">Boost Your Audience Engagement</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connect with your viewers in meaningful ways to build a loyal community around your content.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <GlassCard className="mb-8">
              <h2 className="font-orbitron text-xl font-semibold mb-6">Engagement Strategies</h2>
              
              <div className="space-y-4">
                <StrategyButton
                  icon={<MessageSquare className="h-5 w-5 text-accent" />}
                  title="Comment Management"
                  description="Respond to comments faster with AI-powered suggestions"
                  isActive={activeTab === "comments"}
                  onClick={() => setActiveTab("comments")}
                />
                
                <StrategyButton
                  icon={<Users className="h-5 w-5 text-accent" />}
                  title="Creator Collaborations"
                  description="Connect with other creators in your niche"
                  isActive={activeTab === "collaborations"}
                  onClick={() => setActiveTab("collaborations")}
                />
                
                <StrategyButton
                  icon={<Video className="h-5 w-5 text-accent" />}
                  title="Live Stream Planning"
                  description="Schedule and promote live streams"
                  isActive={activeTab === "livestreams"}
                  onClick={() => setActiveTab("livestreams")}
                />
                
                <StrategyButton
                  icon={<Share2 className="h-5 w-5 text-accent" />}
                  title="Social Media Integration"
                  description="Create a cohesive content strategy across platforms"
                  isActive={activeTab === "social"}
                  onClick={() => setActiveTab("social")}
                />
                
                <StrategyButton
                  icon={<BarChart4 className="h-5 w-5 text-accent" />}
                  title="Analytics & Insights"
                  description="Track engagement metrics and optimize performance"
                  isActive={activeTab === "analytics"}
                  onClick={() => setActiveTab("analytics")}
                />
              </div>
            </GlassCard>
            
            <GlassCard>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-orbitron text-xl font-semibold">Engagement Score</h2>
                <div className="rounded-full bg-gradient-to-r from-accent to-secondary w-12 h-12 flex items-center justify-center text-lg font-bold">
                  B+
                </div>
              </div>
              
              <div className="space-y-4">
                <EngagementScoreItem 
                  label="Comment Response Rate" 
                  score={75} 
                  color="from-green-500 to-green-700" 
                />
                <EngagementScoreItem 
                  label="Community Posts" 
                  score={40} 
                  color="from-yellow-500 to-yellow-700" 
                />
                <EngagementScoreItem 
                  label="Collaboration Activity" 
                  score={60} 
                  color="from-blue-500 to-blue-700" 
                />
                <EngagementScoreItem 
                  label="Live Stream Frequency" 
                  score={30} 
                  color="from-red-500 to-red-700" 
                />
                <EngagementScoreItem 
                  label="Social Media Presence" 
                  score={65} 
                  color="from-purple-500 to-purple-700" 
                />
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-4">
                  Improve your engagement score by implementing the strategies recommended in this section.
                </p>
                <Button className="w-full bg-gradient-to-r from-accent to-secondary hover:opacity-90">
                  Get Personalized Recommendations
                </Button>
              </div>
            </GlassCard>
          </div>
          
          <div className="lg:col-span-2">
            <GlassCard>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="comments">
                  <CommentManagementTab />
                </TabsContent>
                
                <TabsContent value="collaborations">
                  <CollaborationsTab />
                </TabsContent>
                
                <TabsContent value="livestreams">
                  <LiveStreamsTab />
                </TabsContent>
                
                <TabsContent value="social">
                  <SocialMediaTab />
                </TabsContent>
                
                <TabsContent value="analytics">
                  <AnalyticsTab />
                </TabsContent>
              </Tabs>
            </GlassCard>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

function StrategyButton({
  icon,
  title,
  description,
  isActive,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={`w-full justify-start h-auto py-3 px-4 ${
        isActive 
          ? "bg-accent bg-opacity-20 text-accent border border-accent"
          : "bg-dark bg-opacity-50 hover:bg-opacity-70 border-gray-700"
      }`}
      onClick={onClick}
    >
      <div className="flex">
        <div className={`mr-3 ${isActive ? "" : "text-accent"}`}>
          {icon}
        </div>
        <div className="text-left">
          <div className="font-medium">{title}</div>
          <div className="text-xs text-gray-400">{description}</div>
        </div>
      </div>
    </Button>
  );
}

function EngagementScoreItem({
  label,
  score,
  color
}: {
  label: string;
  score: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm">{score}%</span>
      </div>
      <div className="w-full bg-dark h-2 rounded-full">
        <div 
          className={`bg-gradient-to-r ${color} h-2 rounded-full`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}

function CommentManagementTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-xl font-semibold">Comment Management</h2>
        <span className="bg-gradient-to-r from-accent to-secondary text-white px-3 py-1 rounded-full text-xs">AI POWERED</span>
      </div>
      
      <p className="text-gray-400 mb-6">
        Engaging with your audience through comments is one of the most effective ways to build a loyal community around your content.
      </p>
      
      <div className="space-y-6">
        <GlassCard className="border border-gray-800">
          <h3 className="font-medium mb-4">Why Comment Management Matters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
              <p className="font-semibold text-accent mb-1">Higher Retention</p>
              <p className="text-sm text-gray-400">Viewers who receive responses are 62% more likely to watch future videos</p>
            </div>
            <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
              <p className="font-semibold text-accent mb-1">Better Algorithm</p>
              <p className="text-sm text-gray-400">More comments signal to YouTube that your content is engaging</p>
            </div>
            <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
              <p className="font-semibold text-accent mb-1">Community Building</p>
              <p className="text-sm text-gray-400">Creates a sense of community and belonging among viewers</p>
            </div>
          </div>
        </GlassCard>
        
        <div className="mb-6">
          <h3 className="font-medium mb-4">Best Practices</h3>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 bg-dark bg-opacity-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-accent bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <span className="text-accent font-semibold">1</span>
              </div>
              <div>
                <p className="font-medium">Respond within 24 hours</p>
                <p className="text-sm text-gray-400">Early responses have the highest impact on viewer retention</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-dark bg-opacity-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-accent bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <span className="text-accent font-semibold">2</span>
              </div>
              <div>
                <p className="font-medium">Prioritize questions and meaningful comments</p>
                <p className="text-sm text-gray-400">Add value with your responses rather than just saying "thanks"</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-dark bg-opacity-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-accent bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <span className="text-accent font-semibold">3</span>
              </div>
              <div>
                <p className="font-medium">Use our AI comment assistant</p>
                <p className="text-sm text-gray-400">Save time while maintaining your authentic voice</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button className="bg-gradient-to-r from-accent to-secondary hover:opacity-90">
            Go to AI Comment Assistant
          </Button>
        </div>
      </div>
    </div>
  );
}

function CollaborationsTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-xl font-semibold">Creator Collaborations</h2>
        <span className="bg-accent bg-opacity-20 text-accent px-3 py-1 rounded-full text-xs">GROWTH BOOSTER</span>
      </div>
      
      <p className="text-gray-400 mb-6">
        Collaborating with other creators in your niche can significantly expand your reach and introduce your content to new audiences.
      </p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GlassCard className="border border-gray-800">
            <h3 className="font-medium mb-4">Finding Potential Collaborators</h3>
            <div className="space-y-3">
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Similar Channel Size</p>
                <p className="text-sm text-gray-400">Look for creators with similar subscriber counts for mutual benefit</p>
              </div>
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Complementary Content</p>
                <p className="text-sm text-gray-400">Find creators whose content complements yours without direct competition</p>
              </div>
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Engagement Over Numbers</p>
                <p className="text-sm text-gray-400">Prioritize channels with high engagement over those with just high subscriber counts</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="border border-gray-800">
            <h3 className="font-medium mb-4">Collaboration Formats</h3>
            <div className="space-y-3">
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Guest Appearances</p>
                <p className="text-sm text-gray-400">Appear on each other's channels for interviews or discussions</p>
              </div>
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Challenge Videos</p>
                <p className="text-sm text-gray-400">Create challenge videos where both creators participate</p>
              </div>
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Joint Projects</p>
                <p className="text-sm text-gray-400">Work on a series or special project that spans both channels</p>
              </div>
            </div>
          </GlassCard>
        </div>
        
        <div className="p-6 bg-dark bg-opacity-50 rounded-lg border border-accent border-opacity-20 mb-6">
          <h3 className="font-orbitron text-lg font-medium mb-4">Creator Match Feature <span className="bg-accent bg-opacity-20 text-accent px-2 py-0.5 rounded text-xs ml-2">COMING SOON</span></h3>
          <p className="text-gray-400 mb-4">
            We're developing a feature to match you with compatible creators for collaboration opportunities based on your content, audience, and goals.
          </p>
          <Button className="bg-accent bg-opacity-20 text-accent hover:bg-opacity-30 w-full">
            Join the Waitlist
          </Button>
        </div>
        
        <div className="text-center">
          <Button className="bg-gradient-to-r from-accent to-secondary hover:opacity-90">
            Explore Collaboration Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
}

function LiveStreamsTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-xl font-semibold">Live Stream Planning</h2>
        <span className="bg-accent bg-opacity-20 text-accent px-3 py-1 rounded-full text-xs">REAL-TIME ENGAGEMENT</span>
      </div>
      
      <p className="text-gray-400 mb-6">
        Live streaming creates a real-time connection with your audience, boosting engagement and providing immediate feedback on your content.
      </p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <GlassCard className="border border-gray-800">
            <Rocket className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-medium mb-2">Before the Stream</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Schedule at least 48 hours in advance
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Promote on all your social platforms
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Prepare a loose outline of topics
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Test your equipment beforehand
              </li>
            </ul>
          </GlassCard>
          
          <GlassCard className="border border-gray-800">
            <Video className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-medium mb-2">During the Stream</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Greet viewers by name as they join
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Ask questions to encourage chat
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Acknowledge super chats promptly
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Maintain energy throughout
              </li>
            </ul>
          </GlassCard>
          
          <GlassCard className="border border-gray-800">
            <Award className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-medium mb-2">After the Stream</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Edit into highlight clips
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Follow up on questions you missed
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Review analytics for insights
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Plan your next stream based on feedback
              </li>
            </ul>
          </GlassCard>
        </div>
        
        <GlassCard className="mb-6">
          <h3 className="font-medium mb-4">Popular Live Stream Formats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
              <p className="font-medium text-accent mb-1">Q&A Sessions</p>
              <p className="text-sm text-gray-400">Answer viewer questions in real-time</p>
            </div>
            <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
              <p className="font-medium text-accent mb-1">Behind-the-Scenes</p>
              <p className="text-sm text-gray-400">Show your creative process or equipment setup</p>
            </div>
            <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
              <p className="font-medium text-accent mb-1">Live Tutorials</p>
              <p className="text-sm text-gray-400">Teach a skill with real-time feedback</p>
            </div>
            <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
              <p className="font-medium text-accent mb-1">Special Events</p>
              <p className="text-sm text-gray-400">Celebrate milestones with your community</p>
            </div>
          </div>
        </GlassCard>
        
        <div className="text-center">
          <Button className="bg-gradient-to-r from-accent to-secondary hover:opacity-90">
            Plan Your Next Live Stream
          </Button>
        </div>
      </div>
    </div>
  );
}

function SocialMediaTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-xl font-semibold">Social Media Integration</h2>
        <span className="bg-accent bg-opacity-20 text-accent px-3 py-1 rounded-full text-xs">CROSS-PLATFORM GROWTH</span>
      </div>
      
      <p className="text-gray-400 mb-6">
        A strong social media presence amplifies your YouTube content and helps drive traffic to your channel from multiple platforms.
      </p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GlassCard className="border border-gray-800">
            <div className="flex items-center mb-4">
              <Youtube className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="font-medium">YouTube to Social Strategy</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Create Short-Form Clips</p>
                <p className="text-sm text-gray-400">Turn highlights from your videos into shareable clips for social media</p>
              </div>
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Share Behind-the-Scenes</p>
                <p className="text-sm text-gray-400">Post production photos and stories to build anticipation</p>
              </div>
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Create Platform-Specific Teasers</p>
                <p className="text-sm text-gray-400">Adapt your content to suit each platform's format and audience</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="border border-gray-800">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-accent mr-2" />
              <h3 className="font-medium">Optimal Posting Schedule</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-dark bg-opacity-50 rounded-lg">
                <div className="flex items-center">
                  <Twitter className="h-5 w-5 text-blue-400 mr-2" />
                  <span>Twitter</span>
                </div>
                <span className="text-sm text-gray-400">3-5 times daily</span>
              </div>
              <div className="flex justify-between p-3 bg-dark bg-opacity-50 rounded-lg">
                <div className="flex items-center">
                  <Instagram className="h-5 w-5 text-pink-500 mr-2" />
                  <span>Instagram</span>
                </div>
                <span className="text-sm text-gray-400">1-2 times daily</span>
              </div>
              <div className="flex justify-between p-3 bg-dark bg-opacity-50 rounded-lg">
                <div className="flex items-center">
                  <Facebook className="h-5 w-5 text-blue-600 mr-2" />
                  <span>Facebook</span>
                </div>
                <span className="text-sm text-gray-400">Once daily</span>
              </div>
            </div>
          </GlassCard>
        </div>
        
        <GlassCard className="mb-6">
          <h3 className="font-medium mb-4">Platform-Specific Content Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-dark bg-opacity-50 rounded-lg">
              <Twitter className="h-8 w-8 text-blue-400 mb-2" />
              <p className="font-medium mb-1">Twitter</p>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Use hashtags strategically</li>
                <li>• Engage in trending topics</li>
                <li>• Post video clips under 2:20</li>
              </ul>
            </div>
            <div className="p-4 bg-dark bg-opacity-50 rounded-lg">
              <Instagram className="h-8 w-8 text-pink-500 mb-2" />
              <p className="font-medium mb-1">Instagram</p>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Use Reels for maximum reach</li>
                <li>• Share process in Stories</li>
                <li>• Use location and niche tags</li>
              </ul>
            </div>
            <div className="p-4 bg-dark bg-opacity-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-red-400 mb-2" />
              <p className="font-medium mb-1">TikTok</p>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Create native vertical content</li>
                <li>• Hook viewers in first 3 seconds</li>
                <li>• Participate in trends</li>
              </ul>
            </div>
            <div className="p-4 bg-dark bg-opacity-50 rounded-lg">
              <Facebook className="h-8 w-8 text-blue-600 mb-2" />
              <p className="font-medium mb-1">Facebook</p>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Upload native videos</li>
                <li>• Create and engage in groups</li>
                <li>• Schedule live Q&A sessions</li>
              </ul>
            </div>
          </div>
        </GlassCard>
        
        <div className="text-center">
          <Button className="bg-gradient-to-r from-accent to-secondary hover:opacity-90">
            Create Social Media Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-xl font-semibold">Analytics & Insights</h2>
        <span className="bg-accent bg-opacity-20 text-accent px-3 py-1 rounded-full text-xs">DATA-DRIVEN GROWTH</span>
      </div>
      
      <p className="text-gray-400 mb-6">
        Understanding your audience engagement metrics is crucial for optimizing your content strategy and growing your channel.
      </p>
      
      <div className="space-y-6">
        <GlassCard className="border border-gray-800 mb-6">
          <h3 className="font-medium mb-4">Key Engagement Metrics to Track</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
              <p className="font-semibold text-accent mb-1">Watch Time</p>
              <p className="text-sm text-gray-400 mb-2">Total minutes viewers spend watching your videos</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+12% this month</span>
              </div>
            </div>
            <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
              <p className="font-semibold text-accent mb-1">Engagement Rate</p>
              <p className="text-sm text-gray-400 mb-2">Likes, comments, and shares relative to views</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+8% this month</span>
              </div>
            </div>
            <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
              <p className="font-semibold text-accent mb-1">Subscriber Conversion</p>
              <p className="text-sm text-gray-400 mb-2">New subscribers gained per video view</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-yellow-500">+3% this month</span>
              </div>
            </div>
          </div>
        </GlassCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GlassCard className="border border-gray-800">
            <h3 className="font-medium mb-4">Audience Insights</h3>
            <div className="space-y-3">
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">When Your Audience is Active</p>
                <p className="text-sm text-gray-400">Post videos between 3-7 PM when your audience engagement peaks</p>
              </div>
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Audience Demographics</p>
                <p className="text-sm text-gray-400">Your audience is primarily 18-34 year olds interested in technology</p>
              </div>
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Traffic Sources</p>
                <p className="text-sm text-gray-400">45% from search, 30% from suggested videos, 15% from external</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="border border-gray-800">
            <h3 className="font-medium mb-4">Content Performance</h3>
            <div className="space-y-3">
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Top Performing Topics</p>
                <p className="text-sm text-gray-400">Tutorial videos outperform other content types by 35%</p>
              </div>
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Optimal Video Length</p>
                <p className="text-sm text-gray-400">Videos between 8-12 minutes have the highest engagement</p>
              </div>
              <div className="p-3 bg-dark bg-opacity-50 rounded-lg">
                <p className="font-medium mb-1">Titles That Convert</p>
                <p className="text-sm text-gray-400">Titles with numbers and "how to" see 22% higher CTR</p>
              </div>
            </div>
          </GlassCard>
        </div>
        
        <div className="text-center">
          <Button className="bg-gradient-to-r from-accent to-secondary hover:opacity-90">
            View Detailed Analytics Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
