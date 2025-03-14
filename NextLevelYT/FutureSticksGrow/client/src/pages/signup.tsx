import { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import BaseLayout from "@/components/layout/base-layout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/3d-animation";
import { Separator } from "@/components/ui/separator";

const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;
type SocialProvider = "google" | "discord" | "microsoft" | "phone";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);

    try {
      // Check if passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = data;

      const response = await apiRequest("POST", "/api/auth/signup", signupData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account");
      }

      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials",
      });

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSocialSignup = async (provider: SocialProvider) => {
    setIsLoading(true);

    try {
      // In a real app, we'd redirect to the provider's OAuth page
      // For now, we'll simulate a successful signup
      toast({
        title: `${provider} signup initiated`,
        description: "Redirecting to authentication provider...",
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Account created successfully",
        description: `Your account has been created with ${provider}!`,
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(`${provider} signup error:`, error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : `${provider} authentication failed`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <GlassCard>
            <div className="text-center mb-6">
              <h2 className="font-orbitron text-2xl font-bold mb-2">Create Your Account</h2>
              <p className="text-gray-400 text-sm">Join the FutureSticks community</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button 
                variant="outline" 
                className="border border-gray-700 hover:bg-gray-800"
                onClick={() => handleSocialSignup("google")}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>

              <Button 
                variant="outline" 
                className="border border-gray-700 hover:bg-gray-800"
                onClick={() => handleSocialSignup("discord")}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="#5865F2" />
                </svg>
                Discord
              </Button>

              <Button 
                variant="outline" 
                className="border border-gray-700 hover:bg-gray-800"
                onClick={() => handleSocialSignup("microsoft")}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.4 3H3V11.4H11.4V3Z" fill="#F25022"/>
                  <path d="M11.4 12.6H3V21H11.4V12.6Z" fill="#00A4EF"/>
                  <path d="M21 3H12.6V11.4H21V3Z" fill="#7FBA00"/>
                  <path d="M21 12.6H12.6V21H21V12.6Z" fill="#FFB900"/>
                </svg>
                Microsoft
              </Button>

              <Button 
                variant="outline" 
                className="border border-gray-700 hover:bg-gray-800"
                onClick={() => handleSocialSignup("phone")}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.707 12.293a.999.999 0 0 0-1.414 0l-1.594 1.594c-.739-.22-2.118-.72-2.992-1.594s-1.374-2.253-1.594-2.992l1.594-1.594a.999.999 0 0 0 0-1.414l-4-4a.999.999 0 0 0-1.414 0L3.581 5.005c-.38.38-.594.902-.586 1.435.023 1.424.4 6.37 4.298 10.268s8.844 4.274 10.269 4.298h.028c.528 0 1.027-.208 1.405-.586l2.712-2.712a.999.999 0 0 0 0-1.414l-4-4.001zm.587 6.293c-1.248-.021-5.518-.356-8.873-3.712-3.366-3.366-3.692-7.651-3.712-8.874L7 4.414 9.586 7 8.293 8.293a1 1 0 0 0-.272.912c.024.115.611 2.842 2.271 4.502s4.387 2.247 4.502 2.271a.992.992 0 0 0 .912-.271L17 14.414 19.586 17l-1.292 1.293z" fill="#FFFFFF"/>
                </svg>
                Phone
              </Button>
            </div>

            <div className="flex items-center my-6">
              <Separator className="flex-1 bg-gray-700" />
              <span className="px-3 text-sm text-gray-500">or sign up with email</span>
              <Separator className="flex-1 bg-gray-700" />
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your username"
                          className="bg-[#121212] border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          className="bg-[#121212] border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a strong password"
                          className="bg-[#121212] border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          className="bg-[#121212] border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0CFFE1] to-[#8A2BE2] hover:opacity-90 py-3 h-auto mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center text-sm text-gray-400">
                  Already have an account? <Link href="/login"><a className="text-[#0CFFE1] hover:underline">Log in</a></Link>
                </div>
              </form>
            </Form>
          </GlassCard>
        </div>
      </div>
    </BaseLayout>
  );
}