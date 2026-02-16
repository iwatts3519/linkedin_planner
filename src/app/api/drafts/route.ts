import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { generatePost } from "@/lib/anthropic";
import { buildDraftPrompt } from "@/lib/prompts";
import { getIdeaById, getInputById, createPost } from "@/lib/db";

const RequestSchema = z.object({
  ideaId: z.number(),
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

    const { ideaId } = parsed.data;

    // Get idea from database
    const idea = getIdeaById(ideaId);
    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    // Get original input
    const input = getInputById(idea.inputId);
    if (!input) {
      return NextResponse.json(
        { error: "Original input not found" },
        { status: 404 }
      );
    }

    // Generate draft using Claude (default: medium length, professional tone)
    const prompt = buildDraftPrompt(
      idea.title,
      idea.description,
      input.content,
      input.type,
      "medium",
      "professional"
    );
    const generatedPost = await generatePost(prompt);

    // Save post to database
    const post = createPost({
      ideaId: idea.id,
      content: generatedPost.content,
      length: "medium",
      tone: "professional",
      hashtags: generatedPost.hashtags,
      bestTime: generatedPost.bestTime,
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error generating draft:", error);

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
