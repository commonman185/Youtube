import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
});

export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  channelId: text("channel_id").notNull().unique(),
  channelName: text("channel_name").notNull(),
  subscriberCount: integer("subscriber_count"),
  videoCount: integer("video_count"),
  viewCount: integer("view_count"),
  channelThumbnail: text("channel_thumbnail"),
  lastUpdated: text("last_updated"),
});

export const contentIdeas = pgTable("content_ideas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array(),
  isSaved: boolean("is_saved").default(false),
  createdAt: text("created_at").notNull(),
});

export const optimizationTasks = pgTable("optimization_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isCompleted: boolean("is_completed").default(false),
  category: text("category").notNull(),
});

export const commentReplies = pgTable("comment_replies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  videoId: text("video_id").notNull(),
  commentId: text("comment_id").notNull(),
  commentText: text("comment_text").notNull(),
  aiReplySuggestions: jsonb("ai_reply_suggestions").array(),
  chosenReply: text("chosen_reply"),
  sentiment: text("sentiment"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  profilePicture: true,
  bio: true,
});

export const insertChannelSchema = createInsertSchema(channels).pick({
  userId: true,
  channelId: true,
  channelName: true,
  subscriberCount: true,
  videoCount: true,
  viewCount: true,
  channelThumbnail: true,
  lastUpdated: true,
});

export const insertContentIdeaSchema = createInsertSchema(contentIdeas).pick({
  userId: true,
  title: true,
  description: true,
  tags: true,
  isSaved: true,
  createdAt: true,
});

export const insertOptimizationTaskSchema = createInsertSchema(optimizationTasks).pick({
  userId: true,
  title: true,
  description: true,
  isCompleted: true,
  category: true,
});

export const insertCommentReplySchema = createInsertSchema(commentReplies).pick({
  userId: true,
  videoId: true,
  commentId: true,
  commentText: true,
  aiReplySuggestions: true,
  chosenReply: true,
  sentiment: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type Channel = typeof channels.$inferSelect;

export type InsertContentIdea = z.infer<typeof insertContentIdeaSchema>;
export type ContentIdea = typeof contentIdeas.$inferSelect;

export type InsertOptimizationTask = z.infer<typeof insertOptimizationTaskSchema>;
export type OptimizationTask = typeof optimizationTasks.$inferSelect;

export type InsertCommentReply = z.infer<typeof insertCommentReplySchema>;
export type CommentReply = typeof commentReplies.$inferSelect;
