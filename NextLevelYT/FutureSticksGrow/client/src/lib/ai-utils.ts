import { apiRequest } from './queryClient';

/**
 * Interfaces for AI operations using Google Cloud Language API
 */
export interface ContentIdea {
  title: string;
  description: string;
  tags: string[];
}

export interface ContentIdeaResponse {
  ideas: ContentIdea[];
  analysis?: {
    entities: string[];
    inputTopics: string[];
  };
  error?: string;
}

export interface CommentReply {
  sentiment: 'positive' | 'negative' | 'neutral';
  suggestions: string[];
  analysis?: {
    score: number;
    magnitude: number;
  };
}

/**
 * Generate content ideas using AI
 */
export async function generateContentIdeas(
  interests: string,
  targetAudience: string,
  videoLength: string
): Promise<ContentIdea[]> {
  try {
    const response = await apiRequest('POST', '/api/generate-content-ideas', {
      interests,
      targetAudience,
      videoLength
    });
    
    const data = await response.json() as ContentIdeaResponse;
    
    // Log analysis data for transparency
    if (data.analysis) {
      console.log('Content analysis:', data.analysis);
    }
    
    // If there was an error but we still got ideas, log the error
    if (data.error) {
      console.warn('Google API error (fallback ideas used):', data.error);
    }
    
    return data.ideas || [];
  } catch (error) {
    console.error('Error generating content ideas:', error);
    throw new Error('Failed to generate content ideas. Please try again later.');
  }
}

/**
 * Analyze comment sentiment and generate reply suggestions
 */
export async function generateCommentReplies(comment: string): Promise<CommentReply> {
  try {
    const response = await apiRequest('POST', '/api/generate-comment-replies', {
      comment
    });
    
    const data = await response.json() as CommentReply;
    
    // Log analysis data if available
    if (data.analysis) {
      console.log('Sentiment analysis:', data.analysis);
    }
    
    return {
      sentiment: data.sentiment || 'neutral',
      suggestions: data.suggestions || [
        'Thank you for your comment!',
        'I appreciate your feedback!'
      ],
      analysis: data.analysis
    };
  } catch (error) {
    console.error('Error generating comment replies:', error);
    throw new Error('Failed to generate reply suggestions. Please try again later.');
  }
}

/**
 * Predefined optimization tasks
 */
export const defaultOptimizationTasks = [
  {
    title: "Create eye-catching thumbnails",
    description: "Use contrasting colors, clear text, and emotional faces to increase CTR.",
    category: "thumbnails"
  },
  {
    title: "Craft compelling titles",
    description: "Include keywords, numbers, and emotional triggers in your titles.",
    category: "titles"
  },
  {
    title: "Optimize video descriptions",
    description: "Use the first 2-3 lines for important info and include relevant keywords.",
    category: "descriptions"
  },
  {
    title: "Add tags and cards",
    description: "Use relevant tags and add cards to promote your other content.",
    category: "tags"
  },
  {
    title: "Create custom end screens",
    description: "Design engaging end screens to increase watch time and subscriptions.",
    category: "endscreens"
  }
];

/**
 * Predefined engagement strategies
 */
export const engagementStrategies = [
  {
    title: "Comment Management",
    description: "Respond to comments faster with AI-powered suggestions tailored to your style.",
    icon: "comments"
  },
  {
    title: "Creator Collaborations",
    description: "Find and connect with other creators in your niche for mutual growth opportunities.",
    icon: "users"
  },
  {
    title: "Live Stream Planning",
    description: "Schedule and promote live streams to boost real-time engagement with your audience.",
    icon: "video"
  },
  {
    title: "Social Media Integration",
    description: "Connect your social platforms to create a cohesive content strategy across channels.",
    icon: "share-alt"
  }
];
