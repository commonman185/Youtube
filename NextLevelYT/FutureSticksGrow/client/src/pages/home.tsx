import React, { useState } from "react";
import { Link } from "wouter";
import BaseLayout from "@/components/layout/base-layout";
import { HeroAnimation, GlassCard } from "@/components/ui/3d-animation";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <BaseLayout>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Overview */}
      <FeaturesOverview />
      
      {/* Content Suggestions Preview */}
      <ContentSuggestionsPreview />
      
      {/* Optimization Tips Preview */}
      <OptimizationTipsPreview />
      
      {/* Engagement Strategies Preview */}
      <EngagementStrategiesPreview />
    </BaseLayout>
  );
}

function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Accelerate Your <span className="text-gradient">YouTube</span> Channel Growth
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              The ultimate AI-powered platform with advanced tools and strategies for content creators to grow their audience and maximize engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-[#0CFFE1] to-[#8A2BE2] hover:opacity-90 py-3 px-8 h-auto">
                  Get Started Free
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border border-[#0CFFE1] text-[#0CFFE1] hover:bg-[#0CFFE1] hover:bg-opacity-10 py-3 px-8 h-auto"
              >
                Watch Demo <i className="fas fa-play-circle ml-2"></i>
              </Button>
            </div>
            <div className="flex items-center mt-8 text-sm text-gray-400">
              <div className="flex -space-x-2 mr-3">
                <span className="w-8 h-8 rounded-full border-2 border-dark bg-gray-500 flex items-center justify-center text-xs">
                  U1
                </span>
                <span className="w-8 h-8 rounded-full border-2 border-dark bg-gray-600 flex items-center justify-center text-xs">
                  U2
                </span>
                <span className="w-8 h-8 rounded-full border-2 border-dark bg-gray-700 flex items-center justify-center text-xs">
                  U3
                </span>
              </div>
              Trusted by 10,000+ content creators
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <HeroAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesOverview() {
  return (
    <section className="py-20 px-6 bg-dark bg-opacity-50 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">Supercharge Your YouTube Presence</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Unlock powerful tools designed to help content creators optimize their channels, engage with audiences, and grow faster.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard hover padding="p-8">
            <div className="w-14 h-14 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-lightbulb text-2xl text-[#0CFFE1]"></i>
            </div>
            <h3 className="font-orbitron text-xl font-semibold mb-3">AI Content Suggestions</h3>
            <p className="text-gray-400">Get personalized video ideas based on your interests, target audience, and trending topics.</p>
          </GlassCard>
          <GlassCard hover padding="p-8">
            <div className="w-14 h-14 bg-secondary bg-opacity-20 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-chart-line text-2xl text-[#8A2BE2]"></i>
            </div>
            <h3 className="font-orbitron text-xl font-semibold mb-3">Channel Analytics</h3>
            <p className="text-gray-400">Track your performance with detailed metrics and get actionable insights to improve growth.</p>
          </GlassCard>
          <GlassCard hover padding="p-8">
            <div className="w-14 h-14 bg-accent bg-opacity-20 rounded-lg flex items-center justify-center mb-6">
              <i className="fas fa-comments text-2xl text-[#FF1493]"></i>
            </div>
            <h3 className="font-orbitron text-xl font-semibold mb-3">AI Comment Replies</h3>
            <p className="text-gray-400">Engage with your audience effortlessly using AI-powered comment replies that match your tone.</p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function ContentSuggestionsPreview() {
  const [interests, setInterests] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [videoLength, setVideoLength] = useState("Short (under 5 min)");
  
  return (
    <section id="content-suggestions" className="py-20 px-6 relative">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <span className="bg-[#0CFFE1] bg-opacity-20 text-[#0CFFE1] px-4 py-1 rounded-full font-medium text-sm mb-4 inline-block">CONTENT CREATOR TOOLS</span>
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-6">AI-Powered Content Suggestions</h2>
            <p className="text-gray-400 mb-8">Generate fresh video ideas tailored to your channel's niche, audience, and trends. Never run out of content ideas again.</p>
            
            <GlassCard className="mb-8" padding="p-6">
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Your Interests</label>
                  <input 
                    type="text" 
                    placeholder="Gaming, cooking, technology..." 
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#0CFFE1] transition-colors"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Target Audience</label>
                  <input 
                    type="text" 
                    placeholder="Beginners, professionals, students..." 
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#0CFFE1] transition-colors"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Video Length</label>
                  <select 
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#0CFFE1] transition-colors"
                    value={videoLength}
                    onChange={(e) => setVideoLength(e.target.value)}
                  >
                    <option>Short (under 5 min)</option>
                    <option>Medium (5-15 min)</option>
                    <option>Long (15+ min)</option>
                  </select>
                </div>
                <Link href="/content-suggestions">
                  <Button className="w-full bg-gradient-to-r from-[#0CFFE1] to-[#8A2BE2] hover:opacity-90 py-3 px-6 h-auto">
                    Generate Content Ideas
                  </Button>
                </Link>
              </form>
            </GlassCard>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center text-sm">
                <i className="fas fa-bolt mr-2 text-[#0CFFE1]"></i>
                <span>Trending Topics</span>
              </div>
              <div className="flex items-center text-sm">
                <i className="fas fa-search mr-2 text-[#0CFFE1]"></i>
                <span>Keyword Analysis</span>
              </div>
              <div className="flex items-center text-sm">
                <i className="fas fa-calendar-alt mr-2 text-[#0CFFE1]"></i>
                <span>Content Calendar</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 pl-0 md:pl-10">
            <GlassCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-orbitron text-xl">Generated Ideas</h3>
                <span className="bg-gradient-to-r from-[#0CFFE1] to-[#8A2BE2] text-light px-3 py-1 rounded-full text-xs">AI POWERED</span>
              </div>
              
              <div className="mb-4 p-4 bg-[#121212] bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                <div className="flex justify-between">
                  <h4 className="font-medium">Top 10 Gaming Setup Accessories Under $50</h4>
                  <button className="text-[#0CFFE1] hover:text-white transition-colors">
                    <i className="fas fa-bookmark"></i>
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">Review affordable gaming peripherals for budget-conscious gamers. Include price comparisons and practical demonstrations.</p>
                <div className="flex mt-3 gap-2">
                  <span className="text-xs bg-[#0CFFE1] bg-opacity-10 text-[#0CFFE1] px-2 py-1 rounded">Gaming</span>
                  <span className="text-xs bg-[#0CFFE1] bg-opacity-10 text-[#0CFFE1] px-2 py-1 rounded">Equipment</span>
                  <span className="text-xs bg-[#0CFFE1] bg-opacity-10 text-[#0CFFE1] px-2 py-1 rounded">Budget</span>
                </div>
              </div>
              
              <div className="mb-4 p-4 bg-[#121212] bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                <div className="flex justify-between">
                  <h4 className="font-medium">How I Gained 1000 Subscribers in 30 Days</h4>
                  <button className="text-[#0CFFE1] hover:text-white transition-colors">
                    <i className="fas fa-bookmark"></i>
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">Share your experience and strategies for channel growth. Include analytics and specific techniques that worked.</p>
                <div className="flex mt-3 gap-2">
                  <span className="text-xs bg-[#0CFFE1] bg-opacity-10 text-[#0CFFE1] px-2 py-1 rounded">Growth</span>
                  <span className="text-xs bg-[#0CFFE1] bg-opacity-10 text-[#0CFFE1] px-2 py-1 rounded">Strategy</span>
                </div>
              </div>
              
              <Link href="/content-suggestions">
                <Button className="w-full mt-2 border border-[#0CFFE1] text-[#0CFFE1] hover:bg-[#0CFFE1] hover:bg-opacity-10 h-auto py-2">
                  Generate More Ideas <i className="fas fa-arrow-right ml-1"></i>
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function OptimizationTipsPreview() {
  return (
    <section id="optimization" className="py-20 px-6 bg-gradient-radial from-secondary/20 to-dark relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="bg-[#8A2BE2] bg-opacity-20 text-[#8A2BE2] px-4 py-1 rounded-full font-medium text-sm mb-4 inline-block">OPTIMIZATION</span>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">Optimize Your Content for Growth</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Follow our proven optimization strategies to improve your video discoverability, engagement, and overall performance.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <GlassCard>
            <h3 className="font-orbitron text-xl font-semibold mb-5 flex items-center">
              <i className="fas fa-check-circle text-[#8A2BE2] mr-3"></i>
              Video Performance Checklist
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3 h-4 w-4" style={{ accentColor: "#8A2BE2" }} />
                <div>
                  <p className="font-medium">Create eye-catching thumbnails</p>
                  <p className="text-sm text-gray-400">Use contrasting colors, clear text, and emotional faces to increase CTR.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3 h-4 w-4" style={{ accentColor: "#8A2BE2" }} />
                <div>
                  <p className="font-medium">Craft compelling titles</p>
                  <p className="text-sm text-gray-400">Include keywords, numbers, and emotional triggers in your titles.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3 h-4 w-4" style={{ accentColor: "#8A2BE2" }} />
                <div>
                  <p className="font-medium">Optimize video descriptions</p>
                  <p className="text-sm text-gray-400">Use the first 2-3 lines for important info and include relevant keywords.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3 h-4 w-4" style={{ accentColor: "#8A2BE2" }} />
                <div>
                  <p className="font-medium">Add tags and cards</p>
                  <p className="text-sm text-gray-400">Use relevant tags and add cards to promote your other content.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3 h-4 w-4" style={{ accentColor: "#8A2BE2" }} />
                <div>
                  <p className="font-medium">Create custom end screens</p>
                  <p className="text-sm text-gray-400">Design engaging end screens to increase watch time and subscriptions.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-semibold text-[#8A2BE2]">60%</span>
                  <span className="text-gray-400 text-sm ml-2">Completed</span>
                </div>
                <Link href="/optimization-tips">
                  <Button className="text-sm bg-[#8A2BE2] bg-opacity-20 hover:bg-opacity-30 text-[#8A2BE2]">
                    Get Full Checklist
                  </Button>
                </Link>
              </div>
              <div className="w-full bg-[#121212] h-2 rounded-full mt-2">
                <div className="bg-gradient-to-r from-[#0CFFE1] to-[#8A2BE2] h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>
          </GlassCard>
          
          <div>
            <GlassCard className="mb-8">
              <h3 className="font-orbitron text-xl font-semibold mb-5 flex items-center">
                <i className="fas fa-search text-[#8A2BE2] mr-3"></i>
                SEO & Keyword Tools
              </h3>
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2">Research Keywords</label>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Enter topic or keyword" 
                    className="flex-grow bg-[#121212] border border-gray-700 rounded-l-lg px-4 py-3 focus:outline-none focus:border-[#8A2BE2] transition-colors"
                  />
                  <button className="bg-[#8A2BE2] px-4 rounded-r-lg hover:bg-opacity-90 transition-colors">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between p-3 bg-[#121212] bg-opacity-50 rounded-lg">
                  <span>"gaming setup ideas"</span>
                  <div>
                    <span className="text-[#00C851] mr-1">High</span>
                    <span className="text-xs bg-[#00C851] bg-opacity-20 text-[#00C851] px-2 py-1 rounded">135K</span>
                  </div>
                </div>
                <div className="flex justify-between p-3 bg-[#121212] bg-opacity-50 rounded-lg">
                  <span>"budget gaming setup"</span>
                  <div>
                    <span className="text-[#00C851] mr-1">High</span>
                    <span className="text-xs bg-[#00C851] bg-opacity-20 text-[#00C851] px-2 py-1 rounded">89K</span>
                  </div>
                </div>
                <div className="flex justify-between p-3 bg-[#121212] bg-opacity-50 rounded-lg">
                  <span>"gaming desk organization"</span>
                  <div>
                    <span className="text-[#FFD700] mr-1">Medium</span>
                    <span className="text-xs bg-[#FFD700] bg-opacity-20 text-[#FFD700] px-2 py-1 rounded">27K</span>
                  </div>
                </div>
              </div>
              
              <Link href="/optimization-tips">
                <Button className="w-full border border-[#8A2BE2] text-[#8A2BE2] hover:bg-[#8A2BE2] hover:bg-opacity-10 py-2 h-auto">
                  View Detailed Keyword Analysis
                </Button>
              </Link>
            </GlassCard>
            
            <GlassCard>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-orbitron text-xl font-semibold flex items-center">
                  <i className="fas fa-bolt text-[#8A2BE2] mr-3"></i>
                  A/B Testing
                </h3>
                <span className="bg-[#8A2BE2] bg-opacity-20 text-[#8A2BE2] px-3 py-1 rounded-full text-xs">PREMIUM</span>
              </div>
              <p className="text-gray-400 mb-4">Test different thumbnails and titles to find what works best for your audience.</p>
              <Button className="w-full bg-[#8A2BE2] bg-opacity-20 hover:bg-opacity-30 text-[#8A2BE2] py-3 px-4 h-auto">
                Unlock A/B Testing
              </Button>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function EngagementStrategiesPreview() {
  return (
    <section id="engagement" className="py-20 px-6 relative">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <span className="bg-[#FF1493] bg-opacity-20 text-[#FF1493] px-4 py-1 rounded-full font-medium text-sm mb-4 inline-block">ENGAGEMENT</span>
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-6">Boost Your Audience Engagement</h2>
            <p className="text-gray-400 mb-8">Connect with your viewers in meaningful ways to build a loyal community around your content.</p>
            
            <div className="space-y-6">
              <GlassCard padding="p-6">
                <div className="flex">
                  <div className="w-12 h-12 bg-[#FF1493] bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-comments text-[#FF1493]"></i>
                  </div>
                  <div>
                    <h3 className="font-orbitron text-lg font-semibold mb-2">Comment Management</h3>
                    <p className="text-sm text-gray-400">Respond to comments faster with AI-powered suggestions tailored to your style.</p>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard padding="p-6">
                <div className="flex">
                  <div className="w-12 h-12 bg-[#FF1493] bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-users text-[#FF1493]"></i>
                  </div>
                  <div>
                    <h3 className="font-orbitron text-lg font-semibold mb-2">Creator Collaborations</h3>
                    <p className="text-sm text-gray-400">Find and connect with other creators in your niche for mutual growth opportunities.</p>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard padding="p-6">
                <div className="flex">
                  <div className="w-12 h-12 bg-[#FF1493] bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-video text-[#FF1493]"></i>
                  </div>
                  <div>
                    <h3 className="font-orbitron text-lg font-semibold mb-2">Live Stream Planning</h3>
                    <p className="text-sm text-gray-400">Schedule and promote live streams to boost real-time engagement with your audience.</p>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard padding="p-6">
                <div className="flex">
                  <div className="w-12 h-12 bg-[#FF1493] bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-share-alt text-[#FF1493]"></i>
                  </div>
                  <div>
                    <h3 className="font-orbitron text-lg font-semibold mb-2">Social Media Integration</h3>
                    <p className="text-sm text-gray-400">Connect your social platforms to create a cohesive content strategy across channels.</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <GlassCard id="ai-tools">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-orbitron text-xl font-semibold">AI Comment Assistant</h3>
                <span className="bg-gradient-to-r from-[#FF1493] to-[#8A2BE2] text-light px-3 py-1 rounded-full text-xs">AI POWERED</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-[#121212] bg-opacity-50 rounded-lg">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xs mr-3">
                      JM
                    </div>
                    <div>
                      <p className="font-medium mb-1">John Mitchell</p>
                      <p className="text-sm text-gray-400">Your setup tour video was so helpful! I'm wondering what microphone you're using - the audio quality is amazing!</p>
                    </div>
                  </div>
                  
                  <div className="ml-13 pl-10">
                    <p className="text-sm text-gray-300 mb-2">AI Response Suggestions:</p>
                    <div className="space-y-2">
                      <div className="p-2 border border-[#FF1493] rounded-lg text-sm hover:bg-[#FF1493] hover:bg-opacity-10 cursor-pointer transition-colors">
                        Thanks John! I'm using the Blue Yeti X microphone with some custom audio filters in OBS. I can share my exact settings in an upcoming video if you're interested!
                      </div>
                      <div className="p-2 border border-gray-700 rounded-lg text-sm hover:bg-[#FF1493] hover:bg-opacity-10 cursor-pointer transition-colors">
                        Hey John! So glad the video helped you! The mic is a Blue Yeti X - definitely worth the investment if audio quality is important for your content.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-[#121212] bg-opacity-50 rounded-lg">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-xs mr-3">
                      SW
                    </div>
                    <div>
                      <p className="font-medium mb-1">Sarah Williams</p>
                      <p className="text-sm text-gray-400">I've been following your channel for months and your content keeps getting better! Do you have any tips for someone just starting out?</p>
                    </div>
                  </div>
                  
                  <div className="ml-13 pl-10">
                    <p className="text-sm text-gray-300 mb-2">AI Response Suggestions:</p>
                    <div className="space-y-2">
                      <div className="p-2 border border-[#FF1493] rounded-lg text-sm hover:bg-[#FF1493] hover:bg-opacity-10 cursor-pointer transition-colors">
                        Thank you so much, Sarah! For beginners, I'd recommend focusing on consistency over perfection. Start with whatever equipment you have, post regularly, and learn from each video. I also have a "YouTube Beginners Guide" playlist that might help you!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-400">Sentiment Analysis</p>
                <div className="flex gap-3">
                  <span className="flex items-center text-xs">
                    <span className="w-2 h-2 bg-[#00C851] rounded-full mr-1"></span>
                    Positive: 85%
                  </span>
                  <span className="flex items-center text-xs">
                    <span className="w-2 h-2 bg-[#FFD700] rounded-full mr-1"></span>
                    Neutral: 12%
                  </span>
                  <span className="flex items-center text-xs">
                    <span className="w-2 h-2 bg-[#FF4444] rounded-full mr-1"></span>
                    Negative: 3%
                  </span>
                </div>
              </div>
              
              <Link href="/ai-comment-assistant">
                <Button className="w-full bg-gradient-to-r from-[#FF1493] to-[#8A2BE2] hover:opacity-90 py-3 px-6 h-auto">
                  Manage All Comments
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
