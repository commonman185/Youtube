import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BaseLayout from "@/components/layout/base-layout";
import { GlassCard } from "@/components/ui/3d-animation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getYouTubeChannelData, linkYouTubeChannel } from "@/lib/youtube-api";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters" }).optional(),
  profilePicture: z.string().optional(),
});

const channelSchema = z.object({
  channelUrl: z.string().url({ message: "Please enter a valid YouTube URL" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type ChannelFormValues = z.infer<typeof channelSchema>;

export default function Profile() {
  const { toast } = useToast();
  const [isLinking, setIsLinking] = useState(false);
  
  // For demonstration, we're using a hardcoded userId
  // In a real application, this would come from an auth context
  const userId = 1;
  
  // Fetch user profile
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/users', userId],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', `/api/users/${userId}`);
        return response.json();
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    }
  });
  
  // Fetch channel data
  const { 
    data: channelData, 
    isLoading: isLoadingChannel,
    refetch: refetchChannel
  } = useQuery({
    queryKey: ['/api/channels/user', userId],
    queryFn: () => getYouTubeChannelData(userId)
  });
  
  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const response = await apiRequest('PATCH', `/api/users/${userId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Could not update profile",
        variant: "destructive"
      });
    }
  });
  
  // Setup forms
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      profilePicture: user?.profilePicture || "",
    },
    values: {
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      profilePicture: user?.profilePicture || "",
    }
  });
  
  const channelForm = useForm<ChannelFormValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      channelUrl: "",
    }
  });
  
  // Submit handlers
  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };
  
  const onChannelSubmit = async (data: ChannelFormValues) => {
    setIsLinking(true);
    try {
      await linkYouTubeChannel(userId, data.channelUrl);
      toast({
        title: "Channel linked",
        description: "Your YouTube channel has been successfully linked."
      });
      refetchChannel();
      channelForm.reset();
    } catch (error) {
      toast({
        title: "Linking failed",
        description: error instanceof Error ? error.message : "Could not link channel",
        variant: "destructive"
      });
    } finally {
      setIsLinking(false);
    }
  };
  
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-orbitron text-3xl font-bold mb-8">Profile Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <GlassCard>
            <h2 className="font-orbitron text-xl font-semibold mb-6">Personal Information</h2>
            
            {isLoadingUser ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : (
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-dark bg-opacity-50 border-gray-700" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-dark bg-opacity-50 border-gray-700" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="bg-dark bg-opacity-50 border-gray-700 min-h-[120px]" 
                            placeholder="Tell us about yourself and your content"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="profilePicture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Picture URL</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-dark bg-opacity-50 border-gray-700" 
                            placeholder="https://your-image-url.com/profile.jpg"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="text-xs text-gray-400 mt-1">
                          Paste a direct link to your profile image
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes
                      </>
                    ) : "Save Changes"}
                  </Button>
                </form>
              </Form>
            )}
          </GlassCard>
          
          {/* YouTube Channel */}
          <div className="space-y-6">
            <GlassCard>
              <h2 className="font-orbitron text-xl font-semibold mb-6">YouTube Channel</h2>
              
              {isLoadingChannel ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : channelData ? (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xl font-bold mr-4">
                      {channelData.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{channelData.name}</h3>
                      <p className="text-gray-400 text-sm">
                        Channel ID: {channelData.id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-dark bg-opacity-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">{channelData.subscriberCount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">Subscribers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-secondary">{channelData.videoCount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">Videos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-accent">{channelData.viewCount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">Views</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary"
                      onClick={() => refetchChannel()}
                    >
                      Refresh Data
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-destructive text-destructive"
                    >
                      Unlink Channel
                    </Button>
                  </div>
                </div>
              ) : (
                <Form {...channelForm}>
                  <form onSubmit={channelForm.handleSubmit(onChannelSubmit)} className="space-y-6">
                    <FormField
                      control={channelForm.control}
                      name="channelUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube Channel URL</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-dark bg-opacity-50 border-gray-700" 
                              placeholder="https://www.youtube.com/channel/YOURCHANNELID"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                          <div className="text-xs text-gray-400 mt-1">
                            Enter your YouTube channel URL to connect it with NextLevelYT
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      disabled={isLinking}
                    >
                      {isLinking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Linking Channel
                        </>
                      ) : "Link Channel"}
                    </Button>
                  </form>
                </Form>
              )}
            </GlassCard>
            
            <GlassCard>
              <h2 className="font-orbitron text-xl font-semibold mb-6">Privacy & Security</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <div className="space-y-4">
                    <Input 
                      type="password" 
                      placeholder="Current Password" 
                      className="bg-dark bg-opacity-50 border-gray-700" 
                    />
                    <Input 
                      type="password" 
                      placeholder="New Password" 
                      className="bg-dark bg-opacity-50 border-gray-700" 
                    />
                    <Input 
                      type="password" 
                      placeholder="Confirm New Password" 
                      className="bg-dark bg-opacity-50 border-gray-700" 
                    />
                  </div>
                  <Button className="w-full mt-4 bg-secondary bg-opacity-20 text-secondary">
                    Update Password
                  </Button>
                </div>
                
                <div className="pt-6 border-t border-gray-700">
                  <h3 className="font-medium mb-2">Account Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4" style={{ accentColor: "#0CFFE1" }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Two-Factor Authentication</span>
                      <input type="checkbox" className="h-4 w-4" style={{ accentColor: "#0CFFE1" }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Data Analytics Sharing</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4" style={{ accentColor: "#0CFFE1" }} />
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-dark bg-opacity-50 text-white hover:bg-opacity-70">
                    Save Preferences
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
