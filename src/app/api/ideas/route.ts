import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { generateIdeas } from "@/lib/anthropic";
import { buildIdeasPrompt } from "@/lib/prompts";
import { createInput, createIdea, getIdeasByInputId } from "@/lib/db";
import { InputTypeSchema } from "@/types";
import { extractFromUrls } from "@/lib/urlExtractor";

const ContentRequestSchema = z.object({
  type: z.enum(["article", "topic"]),
  content: z.string().min(1, "Content is required"),
});

const UrlRequestSchema = z.object({
  type: z.literal("url"),
  urls: z.array(z.string().url("Invalid URL format")).min(1, "At least one URL is required").max(5, "Maximum 5 URLs allowed"),
});

const RequestSchema = z.union([ContentRequestSchema, UrlRequestSchema]);

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

    const data = parsed.data;
    let type: z.infer<typeof InputTypeSchema>;
    let content: string;
    let sourceUrls: string[] | null = null;
    let warnings: string[] | undefined;

    if (data.type === "url") {
      type = "url";
      sourceUrls = data.urls;

      const extraction = await extractFromUrls(data.urls);

      if (!extraction.combinedText) {
        const errorDetails = extraction.errors.map((e) => `${e.url}: ${e.error}`).join("; ");
        return NextResponse.json(
          { error: `Failed to extract content from any URL. ${errorDetails}` },
          { status: 422 }
        );
      }

      content = extraction.combinedText;

      if (extraction.errors.length > 0) {
        warnings = extraction.errors.map((e) => `Failed to fetch ${e.url}: ${e.error}`);
      }
    } else {
      type = data.type;
      content = data.content;
    }

    // Save input to database
    const input = createInput({ type, content, sourceUrls });

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
      ...(warnings && { warnings }),
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
