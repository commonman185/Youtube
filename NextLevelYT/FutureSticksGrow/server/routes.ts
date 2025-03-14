import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertChannelSchema, insertContentIdeaSchema, insertOptimizationTaskSchema, insertCommentReplySchema } from "@shared/schema";
import { z } from "zod";
import { LanguageServiceClient } from '@google-cloud/language';

// Helper function for validation
const validateRequest = <T>(schema: z.ZodType<T>, data: unknown): { success: true, data: T } | { success: false, error: string } => {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => `${e.path}: ${e.message}`).join(', ') };
    }
    return { success: false, error: 'Invalid input data' };
  }
};

// Initialize Google Cloud Natural Language client
// Using credentials from environment variable GOOGLE_APPLICATION_CREDENTIALS
const languageClient = new LanguageServiceClient({
  fallback: true // Use fallback mode if credentials aren't available
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Test route for Google Cloud Language API
  app.get('/api/test-google-nlp', async (_req: Request, res: Response) => {
    try {
      // Simple sentiment analysis test
      const document = {
        content: 'Hello world! This is a test message from FutureSticks.',
        type: 'PLAIN_TEXT' as const,
      };
      
      const [result] = await languageClient.analyzeSentiment({ document });
      
      res.status(200).json({
        message: 'Google Cloud Language API is working!',
        sentiment: result.documentSentiment,
        success: true
      });
    } catch (error: any) {
      console.error('Google NLP API Error:', error);
      res.status(500).json({
        message: 'Failed to connect to Google Cloud Language API',
        error: error.message,
        success: false
      });
    }
  });
  // Auth routes
  app.post('/api/auth/signup', async (req: Request, res: Response) => {
    const validation = validateRequest(insertUserSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    const { email, username } = validation.data;
    
    // Check if user with email already exists
    const existingUserByEmail = await storage.getUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Check if user with username already exists
    const existingUserByUsername = await storage.getUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'User with this username already exists' });
    }
    
    // Create user
    const user = await storage.createUser(validation.data);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  });
  
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  });
  
  // Social login endpoints
  app.post('/api/auth/social/google', async (req: Request, res: Response) => {
    // In a real implementation, this would verify the Google OAuth token
    // For now, we'll just create or retrieve a user based on the provided email
    const { email, name, imageUrl } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }
    
    // Check if user with email already exists
    let user = await storage.getUserByEmail(email);
    
    if (!user) {
      // Create a new user with the Google info
      const username = email.split('@')[0] + '_google';
      const newUser = {
        username,
        email,
        password: Math.random().toString(36).slice(-10), // Random password
        profilePicture: imageUrl || null,
        bio: null
      };
      
      user = await storage.createUser(newUser);
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  });
  
  app.post('/api/auth/social/discord', async (req: Request, res: Response) => {
    // Similar to Google login but for Discord
    const { email, username, avatarUrl } = req.body;
    
    if (!email || !username) {
      return res.status(400).json({ message: 'Email and username are required' });
    }
    
    // Check if user exists
    let user = await storage.getUserByEmail(email);
    
    if (!user) {
      // Create a new user with Discord info
      const discordUsername = username + '_discord';
      const newUser = {
        username: discordUsername,
        email,
        password: Math.random().toString(36).slice(-10),
        profilePicture: avatarUrl || null,
        bio: null
      };
      
      user = await storage.createUser(newUser);
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  });
  
  app.post('/api/auth/social/microsoft', async (req: Request, res: Response) => {
    // Microsoft login implementation
    const { email, name, imageUrl } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }
    
    // Check if user exists
    let user = await storage.getUserByEmail(email);
    
    if (!user) {
      // Create new user with Microsoft info
      const msUsername = email.split('@')[0] + '_microsoft';
      const newUser = {
        username: msUsername,
        email,
        password: Math.random().toString(36).slice(-10),
        profilePicture: imageUrl || null,
        bio: null
      };
      
      user = await storage.createUser(newUser);
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  });
  
  app.post('/api/auth/phone/send-code', async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    // In a real implementation, this would send a verification code via SMS
    // For now, we'll just simulate the process
    
    // Generate a 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    
    // In a real app, store this code in a temporary storage with an expiration
    // For demo purposes, we'll just return it (this would never be done in production)
    res.status(200).json({ 
      success: true, 
      message: 'Verification code sent',
      // This would be removed in production:
      code: verificationCode
    });
  });
  
  app.post('/api/auth/phone/verify', async (req: Request, res: Response) => {
    const { phoneNumber, code } = req.body;
    
    if (!phoneNumber || !code) {
      return res.status(400).json({ message: 'Phone number and verification code are required' });
    }
    
    // In a real implementation, this would verify the code against what was sent
    // For now, we'll just create or fetch a user with a phone-based username
    
    // Create a unique identifier from the phone number
    const phoneId = Buffer.from(phoneNumber).toString('base64');
    const email = `phone_${phoneId}@futuresticks.app`;
    
    // Check if user exists
    let user = await storage.getUserByEmail(email);
    
    if (!user) {
      // Create new user with phone info
      const username = `user_${phoneId.substring(0, 8)}`;
      const newUser = {
        username,
        email,
        password: Math.random().toString(36).slice(-10),
        profilePicture: null,
        bio: null
      };
      
      user = await storage.createUser(newUser);
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  });
  
  // User routes
  app.get('/api/users/:id', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  });
  
  app.patch('/api/users/:id', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Validate update data
    const updateSchema = insertUserSchema.partial();
    const validation = validateRequest(updateSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    // Update user
    const updatedUser = await storage.updateUser(userId, validation.data);
    if (!updatedUser) {
      return res.status(500).json({ message: 'Failed to update user' });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  });
  
  // Channel routes
  app.post('/api/channels', async (req: Request, res: Response) => {
    const validation = validateRequest(insertChannelSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    // Check if user exists
    const user = await storage.getUser(validation.data.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if channel already exists for this user
    const existingChannel = await storage.getChannelByUserId(validation.data.userId);
    if (existingChannel) {
      return res.status(400).json({ message: 'Channel already exists for this user' });
    }
    
    const channel = await storage.createChannel(validation.data);
    res.status(201).json(channel);
  });
  
  app.get('/api/channels/user/:userId', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const channel = await storage.getChannelByUserId(userId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found for this user' });
    }
    
    res.status(200).json(channel);
  });
  
  app.patch('/api/channels/:id', async (req: Request, res: Response) => {
    const channelId = parseInt(req.params.id);
    if (isNaN(channelId)) {
      return res.status(400).json({ message: 'Invalid channel ID' });
    }
    
    const channel = await storage.getChannel(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    
    // Validate update data
    const updateSchema = insertChannelSchema.partial();
    const validation = validateRequest(updateSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    // Update channel
    const updatedChannel = await storage.updateChannel(channelId, validation.data);
    if (!updatedChannel) {
      return res.status(500).json({ message: 'Failed to update channel' });
    }
    
    res.status(200).json(updatedChannel);
  });
  
  // Content idea routes
  app.post('/api/content-ideas', async (req: Request, res: Response) => {
    const validation = validateRequest(insertContentIdeaSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    // Check if user exists
    const user = await storage.getUser(validation.data.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const contentIdea = await storage.createContentIdea(validation.data);
    res.status(201).json(contentIdea);
  });
  
  app.get('/api/content-ideas/user/:userId', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const contentIdeas = await storage.getContentIdeas(userId);
    res.status(200).json(contentIdeas);
  });
  
  app.patch('/api/content-ideas/:id', async (req: Request, res: Response) => {
    const ideaId = parseInt(req.params.id);
    if (isNaN(ideaId)) {
      return res.status(400).json({ message: 'Invalid idea ID' });
    }
    
    const idea = await storage.getContentIdea(ideaId);
    if (!idea) {
      return res.status(404).json({ message: 'Content idea not found' });
    }
    
    // Validate update data
    const updateSchema = insertContentIdeaSchema.partial();
    const validation = validateRequest(updateSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    // Update idea
    const updatedIdea = await storage.updateContentIdea(ideaId, validation.data);
    if (!updatedIdea) {
      return res.status(500).json({ message: 'Failed to update content idea' });
    }
    
    res.status(200).json(updatedIdea);
  });
  
  app.delete('/api/content-ideas/:id', async (req: Request, res: Response) => {
    const ideaId = parseInt(req.params.id);
    if (isNaN(ideaId)) {
      return res.status(400).json({ message: 'Invalid idea ID' });
    }
    
    const idea = await storage.getContentIdea(ideaId);
    if (!idea) {
      return res.status(404).json({ message: 'Content idea not found' });
    }
    
    const deleted = await storage.deleteContentIdea(ideaId);
    if (!deleted) {
      return res.status(500).json({ message: 'Failed to delete content idea' });
    }
    
    res.status(204).send();
  });
  
  // Optimization task routes
  app.get('/api/optimization-tasks/user/:userId', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const tasks = await storage.getOptimizationTasks(userId);
    res.status(200).json(tasks);
  });
  
  app.post('/api/optimization-tasks', async (req: Request, res: Response) => {
    const validation = validateRequest(insertOptimizationTaskSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    // Check if user exists
    const user = await storage.getUser(validation.data.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const task = await storage.createOptimizationTask(validation.data);
    res.status(201).json(task);
  });
  
  app.patch('/api/optimization-tasks/:id', async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    
    const task = await storage.getOptimizationTask(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Optimization task not found' });
    }
    
    // Validate update data
    const updateSchema = insertOptimizationTaskSchema.partial();
    const validation = validateRequest(updateSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    // Update task
    const updatedTask = await storage.updateOptimizationTask(taskId, validation.data);
    if (!updatedTask) {
      return res.status(500).json({ message: 'Failed to update optimization task' });
    }
    
    res.status(200).json(updatedTask);
  });
  
  // Comment reply routes
  app.post('/api/comment-replies', async (req: Request, res: Response) => {
    const validation = validateRequest(insertCommentReplySchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    // Check if user exists
    const user = await storage.getUser(validation.data.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const reply = await storage.createCommentReply(validation.data);
    res.status(201).json(reply);
  });
  
  app.get('/api/comment-replies/user/:userId', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const replies = await storage.getCommentReplies(userId);
    res.status(200).json(replies);
  });
  
  app.patch('/api/comment-replies/:id', async (req: Request, res: Response) => {
    const replyId = parseInt(req.params.id);
    if (isNaN(replyId)) {
      return res.status(400).json({ message: 'Invalid reply ID' });
    }
    
    const reply = await storage.getCommentReply(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Comment reply not found' });
    }
    
    // Validate update data
    const updateSchema = insertCommentReplySchema.partial();
    const validation = validateRequest(updateSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    // Update reply
    const updatedReply = await storage.updateCommentReply(replyId, validation.data);
    if (!updatedReply) {
      return res.status(500).json({ message: 'Failed to update comment reply' });
    }
    
    res.status(200).json(updatedReply);
  });
  
  // Content generation API for simulating AI features
  app.post('/api/generate-content-ideas', async (req: Request, res: Response) => {
    const { interests, targetAudience, videoLength } = req.body;
    
    if (!interests || !targetAudience || !videoLength) {
      return res.status(400).json({ message: 'Interests, target audience, and video length are required' });
    }
    
    try {
      // Use Google NLP to extract entities from the interests and targetAudience
      const document = {
        content: `Interests: ${interests}. Target audience: ${targetAudience}. Video length: ${videoLength}.`,
        type: 'PLAIN_TEXT' as const,
      };
      
      // Analyze entities with Google's Natural Language API to extract key concepts
      const [entitiesResult] = await languageClient.analyzeEntities({ document });
      const entities = entitiesResult.entities || [];
      
      // Extract relevant entities to use for content idea generation
      const topicEntities = entities
        .filter((entity: any) => entity.type === 'OTHER' || entity.type === 'CONSUMER_GOOD')
        .map((entity: any) => entity.name)
        .slice(0, 3);
      
      // Use the first interest if no entities were found
      const primaryTopic = topicEntities.length > 0 ? topicEntities[0] : interests.split(',')[0].trim();
      const audienceType = targetAudience.split(',')[0].trim();
      
      // Generate content ideas based on extracted entities and user input
      const ideas = [
        {
          title: `Top 10 ${primaryTopic} Tips for ${audienceType}`,
          description: `A comprehensive guide to help ${audienceType} improve their ${primaryTopic} skills.`,
          tags: [primaryTopic, 'tutorial', 'tips']
        },
        {
          title: `How I Grew My ${primaryTopic} Channel by 1000 Subscribers`,
          description: `Share your journey and strategies for growing a successful ${primaryTopic} channel.`,
          tags: ['growth', 'strategy', primaryTopic]
        },
        {
          title: `${videoLength} ${primaryTopic} Challenge for Beginners`,
          description: `An engaging challenge that helps beginners improve their ${primaryTopic} skills quickly.`,
          tags: ['challenge', 'beginners', primaryTopic]
        }
      ];
      
      // Include the analysis data for transparency
      res.status(200).json({
        ideas,
        analysis: {
          entities: topicEntities,
          inputTopics: interests.split(',').map((i: string) => i.trim())
        }
      });
    } catch (error: any) {
      console.error('Error generating content ideas:', error);
      // Fallback to basic generation if Google API fails
      const ideas = [
        {
          title: `Top 10 ${interests.split(',')[0].trim()} Tips for ${targetAudience.split(',')[0].trim()}`,
          description: `A comprehensive guide to help ${targetAudience.split(',')[0].trim()} improve their ${interests.split(',')[0].trim()} skills.`,
          tags: [interests.split(',')[0].trim(), 'tutorial', 'tips']
        },
        {
          title: `How I Grew My ${interests.split(',')[0].trim()} Channel by 1000 Subscribers`,
          description: `Share your journey and strategies for growing a successful ${interests.split(',')[0].trim()} channel.`,
          tags: ['growth', 'strategy', interests.split(',')[0].trim()]
        },
        {
          title: `${videoLength} ${interests.split(',')[0].trim()} Challenge for Beginners`,
          description: `An engaging challenge that helps beginners improve their ${interests.split(',')[0].trim()} skills quickly.`,
          tags: ['challenge', 'beginners', interests.split(',')[0].trim()]
        }
      ];
      
      res.status(200).json({ 
        ideas,
        error: error.message || 'Unknown error occurred'
      });
    }
  });
  
  app.post('/api/generate-comment-replies', async (req: Request, res: Response) => {
    const { comment } = req.body;
    
    if (!comment) {
      return res.status(400).json({ message: 'Comment is required' });
    }
    
    try {
      // Use Google Cloud Natural Language API to analyze sentiment
      const document = {
        content: comment,
        type: 'PLAIN_TEXT' as const,
      };
      
      // Analyze sentiment with Google's Natural Language API
      const [result] = await languageClient.analyzeSentiment({ document });
      const sentiment = result.documentSentiment || { score: 0, magnitude: 0 };
      
      // Determine sentiment category based on score
      // Google NL API returns score between -1.0 (negative) and 1.0 (positive)
      let sentimentCategory: 'positive' | 'negative' | 'neutral';
      
      const score = sentiment.score || 0;
      
      if (score >= 0.2) {
        sentimentCategory = 'positive';
      } else if (score <= -0.2) {
        sentimentCategory = 'negative';
      } else {
        sentimentCategory = 'neutral';
      }
      
      // Generate appropriate reply suggestions based on sentiment
      const suggestions = [];
      
      if (sentimentCategory === 'positive') {
        suggestions.push(
          `Thank you so much for your kind words! I'm glad you enjoyed the content!`,
          `I really appreciate your positive feedback! What aspect did you enjoy the most?`
        );
      } else if (sentimentCategory === 'negative') {
        suggestions.push(
          `I'm sorry to hear that. Could you let me know what specifically didn't meet your expectations?`,
          `Thank you for your honest feedback. I'm always looking to improve, and your input helps me do that.`
        );
      } else {
        suggestions.push(
          `Thanks for your comment! Let me know if you have any questions.`,
          `I appreciate you taking the time to watch and comment! Is there anything else you'd like to see in future videos?`
        );
      }
      
      res.status(200).json({
        sentiment: sentimentCategory,
        suggestions,
        analysis: {
          score: sentiment.score || 0,
          magnitude: sentiment.magnitude || 0
        }
      });
    } catch (error: any) {
      console.error('Error analyzing sentiment:', error);
      res.status(500).json({ 
        message: 'Failed to analyze comment sentiment',
        error: error.message || 'Unknown error occurred'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
