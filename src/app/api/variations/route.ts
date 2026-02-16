import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { generatePost } from "@/lib/anthropic";
import { buildVariationPrompt } from "@/lib/prompts";
import { getPostById, createPost } from "@/lib/db";
import { PostLengthSchema, PostToneSchema } from "@/types";

const RequestSchema = z.object({
  postId: z.number(),
  length: PostLengthSchema,
  tone: PostToneSchema,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { postId, length, tone } = parsed.data;

    // Get original post from database
    const originalPost = getPostById(postId);
    if (!originalPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if variation already exists
    if (originalPost.length === length && originalPost.tone === tone) {
      return NextResponse.json(
        { error: "Requested variation matches the original post" },
        { status: 400 }
      );
    }

    // Generate variation using Claude
    const prompt = buildVariationPrompt(
      originalPost.content,
      originalPost.length,
      originalPost.tone,
      length,
      tone
    );
    const generatedPost = await generatePost(prompt);

    // Save variation to database
    const post = createPost({
      ideaId: originalPost.ideaId,
      content: generatedPost.content,
      length,
      tone,
      hashtags: generatedPost.hashtags,
      bestTime: generatedPost.bestTime,
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error generating variation:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
