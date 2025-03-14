import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateContentIdeas } from "@/lib/ai-utils";
import { generateDateString } from "@/lib/utils";
import BaseLayout from "@/components/layout/base-layout";
import { GlassCard, HeroAnimation } from "@/components/ui/3d-animation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Bookmark, PlusCircle, Zap, Search, CalendarDays } from "lucide-react";

const contentFormSchema = z.object({
  interests: z.string().min(1, { message: "Please enter at least one interest" }),
  targetAudience: z.string().min(1, { message: "Please specify your target audience" }),
  videoLength: z.string(),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

export default function ContentSuggestions() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // For demonstration, we're using a hardcoded userId
  // In a real application, this would come from an auth context
  const userId = 1;
  
  // Load saved content ideas
  const { data: savedIdeas = [], isLoading: isLoadingSaved } = useQuery({
    queryKey: ['/api/content-ideas/user', userId],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', `/api/content-ideas/user/${userId}`);
        return response.json();
      } catch (error) {
        console.error("Error fetching saved ideas:", error);
        return [];
      }
    }
  });
  
  // Form setup
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      interests: "",
      targetAudience: "",
      videoLength: "Short (under 5 min)"
    }
  });
  
  // Save idea mutation
  const saveIdeaMutation = useMutation({
    mutationFn: async (idea: any) => {
      const response = await apiRequest('POST', '/api/content-ideas', {
        userId,
        title: idea.title,
        description: idea.description,
        tags: idea.tags,
        isSaved: true,
        createdAt: generateDateString()
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-ideas/user', userId] });
      toast({
        title: "Idea saved",
        description: "The content idea has been saved to your collection.",
      });
    },
    onError: (error) => {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Could not save idea",
        variant: "destructive"
      });
    }
  });
  
  // Toggle idea bookmark status
  const toggleBookmark = useMutation({
    mutationFn: async (ideaId: number) => {
      // Find the idea first
      const idea = savedIdeas.find(idea => idea.id === ideaId);
      if (!idea) throw new Error("Idea not found");
      
      const response = await apiRequest('PATCH', `/api/content-ideas/${ideaId}`, {
        isSaved: !idea.isSaved
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-ideas/user', userId] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Could not update idea",
        variant: "destructive"
      });
    }
  });
  
  const onSubmit = async (data: ContentFormValues) => {
    setIsGenerating(true);
    try {
      const ideas = await generateContentIdeas(data.interests, data.targetAudience, data.videoLength);
      setGeneratedIdeas(ideas);
      toast({
        title: "Ideas generated",
        description: `Generated ${ideas.length} content ideas based on your preferences.`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Could not generate ideas",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveIdea = (idea: any) => {
    saveIdeaMutation.mutate(idea);
  };
  
  const handleToggleSavedIdea = (ideaId: number) => {
    toggleBookmark.mutate(ideaId);
  };
  
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl font-bold mb-4">Content Suggestions</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Generate fresh video ideas tailored to your channel's niche, audience, and trends. Never run out of content ideas again.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <GlassCard className="mb-8">
              <h2 className="font-orbitron text-xl font-semibold mb-6">Generate Ideas</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Interests</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Gaming, cooking, technology..." 
                            className="bg-dark bg-opacity-50 border-gray-700" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Beginners, professionals, students..." 
                            className="bg-dark bg-opacity-50 border-gray-700" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="videoLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video Length</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-dark bg-opacity-50 border-gray-700">
                              <SelectValue placeholder="Select a video length" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-dark border-gray-700">
                            <SelectItem value="Short (under 5 min)">Short (under 5 min)</SelectItem>
                            <SelectItem value="Medium (5-15 min)">Medium (5-15 min)</SelectItem>
                            <SelectItem value="Long (15+ min)">Long (15+ min)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Ideas...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Generate Content Ideas
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </GlassCard>
            
            <GlassCard>
              <div className="flex items-center mb-6 space-x-2">
                <h2 className="font-orbitron text-xl font-semibold">Content Tools</h2>
                <span className="bg-gradient-to-r from-primary to-secondary text-light px-3 py-1 rounded-full text-xs">PREMIUM</span>
              </div>
              
              <div className="space-y-4">
                <Button className="w-full justify-start bg-dark bg-opacity-50 hover:bg-opacity-70 text-left h-auto py-3">
                  <Zap className="h-5 w-5 text-primary mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Trending Topics</div>
                    <div className="text-xs text-gray-400">Discover hot topics in your niche</div>
                  </div>
                </Button>
                
                <Button className="w-full justify-start bg-dark bg-opacity-50 hover:bg-opacity-70 text-left h-auto py-3">
                  <Search className="h-5 w-5 text-secondary mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Keyword Analysis</div>
                    <div className="text-xs text-gray-400">Find high-performing keywords</div>
                  </div>
                </Button>
                
                <Button className="w-full justify-start bg-dark bg-opacity-50 hover:bg-opacity-70 text-left h-auto py-3">
                  <CalendarDays className="h-5 w-5 text-accent mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Content Calendar</div>
                    <div className="text-xs text-gray-400">Plan your content schedule</div>
                  </div>
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                <p className="text-sm text-gray-400 mb-4">Unlock premium tools to enhance your content strategy</p>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  Upgrade to Premium
                </Button>
              </div>
            </GlassCard>
          </div>
          
          <div className="lg:col-span-3">
            {/* Generated Ideas */}
            {generatedIdeas.length > 0 && (
              <GlassCard className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-orbitron text-xl font-semibold">Generated Ideas</h2>
                  <span className="bg-gradient-to-r from-primary to-secondary text-light px-3 py-1 rounded-full text-xs">AI POWERED</span>
                </div>
                
                <div className="space-y-4">
                  {generatedIdeas.map((idea, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-dark bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{idea.title}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-white transition-colors h-8 w-8 p-0"
                          onClick={() => handleSaveIdea(idea)}
                          disabled={saveIdeaMutation.isPending}
                        >
                          {saveIdeaMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{idea.description}</p>
                      <div className="flex mt-3 gap-2">
                        {idea.tags.map((tag: string, tagIndex: number) => (
                          <span 
                            key={tagIndex} 
                            className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full mt-6 border border-primary text-primary hover:bg-primary hover:bg-opacity-10"
                  onClick={() => form.handleSubmit(onSubmit)()}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating More...
                    </>
                  ) : (
                    <>Generate More Ideas <i className="fas fa-arrow-right ml-1"></i></>
                  )}
                </Button>
              </GlassCard>
            )}
            
            {/* Saved Ideas */}
            <GlassCard>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-orbitron text-xl font-semibold">Saved Ideas</h2>
                <div className="text-sm text-gray-400">
                  {savedIdeas.length} {savedIdeas.length === 1 ? 'idea' : 'ideas'} saved
                </div>
              </div>
              
              {isLoadingSaved ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : savedIdeas.length > 0 ? (
                <div className="space-y-4">
                  {savedIdeas.map((idea) => (
                    <div 
                      key={idea.id} 
                      className="p-4 bg-dark bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{idea.title}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`${
                            idea.isSaved ? 'text-primary' : 'text-gray-400'
                          } hover:text-white transition-colors h-8 w-8 p-0`}
                          onClick={() => handleToggleSavedIdea(idea.id)}
                          disabled={toggleBookmark.isPending}
                        >
                          {toggleBookmark.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Bookmark className="h-4 w-4" fill={idea.isSaved ? '#0CFFE1' : 'none'} />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{idea.description}</p>
                      <div className="flex mt-3 gap-2">
                        {idea.tags.map((tag: string, tagIndex: number) => (
                          <span 
                            key={tagIndex} 
                            className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400 mb-4">No saved ideas yet</p>
                  <p className="text-sm text-gray-500 mb-6">
                    Generate new content ideas and save them for later
                  </p>
                  <div className="h-48 mb-6">
                    <HeroAnimation height="h-48" />
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Generate Your First Ideas
                  </Button>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
