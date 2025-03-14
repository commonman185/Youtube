import { 
  users, type User, type InsertUser,
  channels, type Channel, type InsertChannel,
  contentIdeas, type ContentIdea, type InsertContentIdea,
  optimizationTasks, type OptimizationTask, type InsertOptimizationTask,
  commentReplies, type CommentReply, type InsertCommentReply
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Channel operations
  getChannel(id: number): Promise<Channel | undefined>;
  getChannelByUserId(userId: number): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  updateChannel(id: number, channel: Partial<InsertChannel>): Promise<Channel | undefined>;
  
  // Content idea operations
  getContentIdeas(userId: number): Promise<ContentIdea[]>;
  getContentIdea(id: number): Promise<ContentIdea | undefined>;
  createContentIdea(idea: InsertContentIdea): Promise<ContentIdea>;
  updateContentIdea(id: number, idea: Partial<InsertContentIdea>): Promise<ContentIdea | undefined>;
  deleteContentIdea(id: number): Promise<boolean>;
  
  // Optimization task operations
  getOptimizationTasks(userId: number): Promise<OptimizationTask[]>;
  getOptimizationTask(id: number): Promise<OptimizationTask | undefined>;
  createOptimizationTask(task: InsertOptimizationTask): Promise<OptimizationTask>;
  updateOptimizationTask(id: number, task: Partial<InsertOptimizationTask>): Promise<OptimizationTask | undefined>;
  
  // Comment reply operations
  getCommentReplies(userId: number): Promise<CommentReply[]>;
  getCommentReply(id: number): Promise<CommentReply | undefined>;
  createCommentReply(reply: InsertCommentReply): Promise<CommentReply>;
  updateCommentReply(id: number, reply: Partial<InsertCommentReply>): Promise<CommentReply | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private channels: Map<number, Channel>;
  private contentIdeas: Map<number, ContentIdea>;
  private optimizationTasks: Map<number, OptimizationTask>;
  private commentReplies: Map<number, CommentReply>;
  
  private userIdCounter: number;
  private channelIdCounter: number;
  private contentIdeaIdCounter: number;
  private optimizationTaskIdCounter: number;
  private commentReplyIdCounter: number;

  constructor() {
    this.users = new Map();
    this.channels = new Map();
    this.contentIdeas = new Map();
    this.optimizationTasks = new Map();
    this.commentReplies = new Map();
    
    this.userIdCounter = 1;
    this.channelIdCounter = 1;
    this.contentIdeaIdCounter = 1;
    this.optimizationTaskIdCounter = 1;
    this.commentReplyIdCounter = 1;
    
    // Initialize with default optimization tasks
    this.createOptimizationTask({
      userId: 0, // Default for all users
      title: "Create eye-catching thumbnails",
      description: "Use contrasting colors, clear text, and emotional faces to increase CTR.",
      isCompleted: false,
      category: "thumbnails"
    });
    
    this.createOptimizationTask({
      userId: 0,
      title: "Craft compelling titles",
      description: "Include keywords, numbers, and emotional triggers in your titles.",
      isCompleted: false,
      category: "titles"
    });
    
    this.createOptimizationTask({
      userId: 0,
      title: "Optimize video descriptions",
      description: "Use the first 2-3 lines for important info and include relevant keywords.",
      isCompleted: false,
      category: "descriptions"
    });
    
    this.createOptimizationTask({
      userId: 0,
      title: "Add tags and cards",
      description: "Use relevant tags and add cards to promote your other content.",
      isCompleted: false,
      category: "tags"
    });
    
    this.createOptimizationTask({
      userId: 0,
      title: "Create custom end screens",
      description: "Design engaging end screens to increase watch time and subscriptions.",
      isCompleted: false,
      category: "endscreens"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Channel operations
  async getChannel(id: number): Promise<Channel | undefined> {
    return this.channels.get(id);
  }
  
  async getChannelByUserId(userId: number): Promise<Channel | undefined> {
    return Array.from(this.channels.values()).find(
      (channel) => channel.userId === userId
    );
  }
  
  async createChannel(channel: InsertChannel): Promise<Channel> {
    const id = this.channelIdCounter++;
    const newChannel: Channel = { ...channel, id };
    this.channels.set(id, newChannel);
    return newChannel;
  }
  
  async updateChannel(id: number, channelData: Partial<InsertChannel>): Promise<Channel | undefined> {
    const channel = await this.getChannel(id);
    if (!channel) return undefined;
    
    const updatedChannel = { ...channel, ...channelData };
    this.channels.set(id, updatedChannel);
    return updatedChannel;
  }

  // Content idea operations
  async getContentIdeas(userId: number): Promise<ContentIdea[]> {
    return Array.from(this.contentIdeas.values()).filter(
      (idea) => idea.userId === userId
    );
  }
  
  async getContentIdea(id: number): Promise<ContentIdea | undefined> {
    return this.contentIdeas.get(id);
  }
  
  async createContentIdea(idea: InsertContentIdea): Promise<ContentIdea> {
    const id = this.contentIdeaIdCounter++;
    const newIdea: ContentIdea = { ...idea, id };
    this.contentIdeas.set(id, newIdea);
    return newIdea;
  }
  
  async updateContentIdea(id: number, ideaData: Partial<InsertContentIdea>): Promise<ContentIdea | undefined> {
    const idea = await this.getContentIdea(id);
    if (!idea) return undefined;
    
    const updatedIdea = { ...idea, ...ideaData };
    this.contentIdeas.set(id, updatedIdea);
    return updatedIdea;
  }
  
  async deleteContentIdea(id: number): Promise<boolean> {
    return this.contentIdeas.delete(id);
  }

  // Optimization task operations
  async getOptimizationTasks(userId: number): Promise<OptimizationTask[]> {
    // Return both user-specific tasks and default tasks (userId = 0)
    return Array.from(this.optimizationTasks.values()).filter(
      (task) => task.userId === userId || task.userId === 0
    );
  }
  
  async getOptimizationTask(id: number): Promise<OptimizationTask | undefined> {
    return this.optimizationTasks.get(id);
  }
  
  async createOptimizationTask(task: InsertOptimizationTask): Promise<OptimizationTask> {
    const id = this.optimizationTaskIdCounter++;
    const newTask: OptimizationTask = { ...task, id };
    this.optimizationTasks.set(id, newTask);
    return newTask;
  }
  
  async updateOptimizationTask(id: number, taskData: Partial<InsertOptimizationTask>): Promise<OptimizationTask | undefined> {
    const task = await this.getOptimizationTask(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskData };
    this.optimizationTasks.set(id, updatedTask);
    return updatedTask;
  }

  // Comment reply operations
  async getCommentReplies(userId: number): Promise<CommentReply[]> {
    return Array.from(this.commentReplies.values()).filter(
      (reply) => reply.userId === userId
    );
  }
  
  async getCommentReply(id: number): Promise<CommentReply | undefined> {
    return this.commentReplies.get(id);
  }
  
  async createCommentReply(reply: InsertCommentReply): Promise<CommentReply> {
    const id = this.commentReplyIdCounter++;
    const newReply: CommentReply = { ...reply, id };
    this.commentReplies.set(id, newReply);
    return newReply;
  }
  
  async updateCommentReply(id: number, replyData: Partial<InsertCommentReply>): Promise<CommentReply | undefined> {
    const reply = await this.getCommentReply(id);
    if (!reply) return undefined;
    
    const updatedReply = { ...reply, ...replyData };
    this.commentReplies.set(id, updatedReply);
    return updatedReply;
  }
}

export const storage = new MemStorage();
