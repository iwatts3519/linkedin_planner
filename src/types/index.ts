import { z } from "zod/v4";

// Input types
export const InputTypeSchema = z.enum(["article", "topic"]);
export type InputType = z.infer<typeof InputTypeSchema>;

export const InputSchema = z.object({
  id: z.number(),
  type: InputTypeSchema,
  content: z.string(),
  createdAt: z.string(),
});
export type Input = z.infer<typeof InputSchema>;

export const CreateInputSchema = z.object({
  type: InputTypeSchema,
  content: z.string().min(1, "Content is required"),
});
export type CreateInput = z.infer<typeof CreateInputSchema>;

// Idea types
export const IdeaSchema = z.object({
  id: z.number(),
  inputId: z.number(),
  title: z.string(),
  description: z.string(),
  createdAt: z.string(),
});
export type Idea = z.infer<typeof IdeaSchema>;

export const CreateIdeaSchema = z.object({
  inputId: z.number(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});
export type CreateIdea = z.infer<typeof CreateIdeaSchema>;

// Post types
export const PostLengthSchema = z.enum(["short", "medium", "long"]);
export type PostLength = z.infer<typeof PostLengthSchema>;

export const PostToneSchema = z.enum([
  "professional",
  "conversational",
  "storytelling",
  "thought-leader",
]);
export type PostTone = z.infer<typeof PostToneSchema>;

export const PostSchema = z.object({
  id: z.number(),
  ideaId: z.number(),
  content: z.string(),
  length: PostLengthSchema,
  tone: PostToneSchema,
  hashtags: z.array(z.string()),
  bestTime: z.string().nullable(),
  createdAt: z.string(),
});
export type Post = z.infer<typeof PostSchema>;

export const CreatePostSchema = z.object({
  ideaId: z.number(),
  content: z.string().min(1, "Content is required"),
  length: PostLengthSchema,
  tone: PostToneSchema,
  hashtags: z.array(z.string()).default([]),
  bestTime: z.string().nullable().default(null),
});
export type CreatePost = z.infer<typeof CreatePostSchema>;

// API response types
export const GeneratedIdeaSchema = z.object({
  title: z.string(),
  description: z.string(),
});
export type GeneratedIdea = z.infer<typeof GeneratedIdeaSchema>;

export const GeneratedPostSchema = z.object({
  content: z.string(),
  hashtags: z.array(z.string()),
  bestTime: z.string(),
});
export type GeneratedPost = z.infer<typeof GeneratedPostSchema>;
