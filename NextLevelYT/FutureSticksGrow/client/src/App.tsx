import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import ContentSuggestions from "@/pages/content-suggestions";
import OptimizationTips from "@/pages/optimization-tips";
import EngagementStrategies from "@/pages/engagement-strategies";
import AICommentAssistant from "@/pages/ai-comment-assistant";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/content-suggestions" component={ContentSuggestions} />
      <Route path="/optimization-tips" component={OptimizationTips} />
      <Route path="/engagement-strategies" component={EngagementStrategies} />
      <Route path="/ai-comment-assistant" component={AICommentAssistant} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}