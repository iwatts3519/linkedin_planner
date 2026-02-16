import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { generateIdeas } from "@/lib/anthropic";
import { buildIdeasPrompt } from "@/lib/prompts";
import { createInput, createIdea, getIdeasByInputId } from "@/lib/db";
import { InputTypeSchema } from "@/types";

const RequestSchema = z.object({
  type: InputTypeSchema,
  content: z.string().min(1, "Content is required"),
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

    const { type, content } = parsed.data;

    // Save input to database
    const input = createInput({ type, content });

    // Generate ideas using Claude
    const prompt = buildIdeasPrompt(type, content);
    const generatedIdeas = await generateIdeas(prompt);

    // Save ideas to database
    for (const idea of generatedIdeas) {
      createIdea({
        inputId: input.id,
        title: idea.title,
        description: idea.description,
      });
    }

    // Retrieve saved ideas with IDs
    const savedIdeas = getIdeasByInputId(input.id);

    return NextResponse.json({
      input,
      ideas: savedIdeas,
    });
  } catch (error) {
    console.error("Error generating ideas:", error);

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
