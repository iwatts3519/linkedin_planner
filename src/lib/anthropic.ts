import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod/v4";
import type { GeneratedIdea, GeneratedPost } from "@/types";
import { GeneratedIdeaSchema, GeneratedPostSchema } from "@/types";

const client = new Anthropic();

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export class AnthropicError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = "AnthropicError";
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      if (error instanceof Anthropic.RateLimitError) {
        await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
        continue;
      }

      if (error instanceof Anthropic.APIConnectionError) {
        await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
        continue;
      }

      // Non-retryable errors
      throw error;
    }
  }

  throw lastError;
}

function extractJsonFromResponse(text: string): string {
  // Try to extract JSON from markdown code blocks
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    return jsonBlockMatch[1].trim();
  }

  // Try to find raw JSON array or object
  const jsonMatch = text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }

  return text.trim();
}

export async function generateIdeas(
  prompt: string
): Promise<GeneratedIdea[]> {
  const response = await callWithRetry(async () => {
    return client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new AnthropicError(
      "Unexpected response type from Claude",
      "INVALID_RESPONSE"
    );
  }

  const jsonStr = extractJsonFromResponse(content.text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new AnthropicError(
      "Failed to parse Claude response as JSON",
      "PARSE_ERROR"
    );
  }

  const IdeasArraySchema = z.array(GeneratedIdeaSchema);
  const result = IdeasArraySchema.safeParse(parsed);

  if (!result.success) {
    throw new AnthropicError(
      `Invalid ideas format: ${result.error.message}`,
      "VALIDATION_ERROR"
    );
  }

  return result.data;
}

export async function generatePost(
  prompt: string
): Promise<GeneratedPost> {
  const response = await callWithRetry(async () => {
    return client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new AnthropicError(
      "Unexpected response type from Claude",
      "INVALID_RESPONSE"
    );
  }

  const jsonStr = extractJsonFromResponse(content.text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new AnthropicError(
      "Failed to parse Claude response as JSON",
      "PARSE_ERROR"
    );
  }

  const result = GeneratedPostSchema.safeParse(parsed);

  if (!result.success) {
    throw new AnthropicError(
      `Invalid post format: ${result.error.message}`,
      "VALIDATION_ERROR"
    );
  }

  return result.data;
}
