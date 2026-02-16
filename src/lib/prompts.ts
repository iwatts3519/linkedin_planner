import type { InputType, PostLength, PostTone } from "@/types";

export function buildIdeasPrompt(type: InputType, content: string): string {
  const contextDescription =
    type === "article"
      ? "Based on the following article, generate LinkedIn post ideas that would engage professionals and spark discussions."
      : "Based on the following topic/keyword, generate LinkedIn post ideas that would engage professionals and spark discussions.";

  return `You are a LinkedIn content strategist helping create engaging professional posts.

${contextDescription}

${type === "article" ? "ARTICLE:" : "TOPIC:"}
${content}

Generate 3-5 unique LinkedIn post ideas. Each idea should take a different angle:
- How-to or practical advice
- Opinion or hot take
- Personal story or experience
- Data-driven insight
- Thought-provoking question

For each idea, provide:
1. A catchy title (5-10 words)
2. A brief description of the post angle and key points to cover (2-3 sentences)

Respond with a JSON array only, no other text. Format:
[
  {
    "title": "Post Title Here",
    "description": "Brief description of the angle and key points."
  }
]`;
}

export function buildDraftPrompt(
  ideaTitle: string,
  ideaDescription: string,
  originalContent: string,
  originalType: InputType,
  length: PostLength = "medium",
  tone: PostTone = "professional"
): string {
  const lengthGuide = {
    short: "around 500 characters (concise and punchy)",
    medium: "around 1500 characters (balanced depth)",
    long: "around 2500 characters (comprehensive)",
  };

  const toneGuide = {
    professional:
      "Professional and authoritative - use industry terminology appropriately, maintain credibility",
    conversational:
      "Conversational and relatable - write like you're talking to a colleague, use contractions",
    storytelling:
      "Storytelling - use narrative techniques, paint pictures with words, build emotional connection",
    "thought-leader":
      "Thought-leader - challenge assumptions, share unique perspectives, inspire action",
  };

  return `You are a LinkedIn content writer creating an engaging post.

ORIGINAL ${originalType === "article" ? "ARTICLE" : "TOPIC"}:
${originalContent}

POST IDEA TO EXPAND:
Title: ${ideaTitle}
Description: ${ideaDescription}

REQUIREMENTS:
- Length: ${lengthGuide[length]}
- Tone: ${toneGuide[tone]}
- Include a strong hook in the first 1-2 lines (this is what people see before "see more")
- End with a clear call-to-action (question, invitation to comment, etc.)
- Make it scannable with line breaks between key points
- Be authentic and avoid corporate jargon

HASHTAGS:
- Include 5-7 relevant hashtags
- Mix popular hashtags with niche ones
- Format: lowercase with no spaces (e.g., #linkedintips)

POSTING TIME:
- Suggest the best day and time to post (e.g., "Tuesday 8-9 AM EST")
- LinkedIn engagement peaks on weekday mornings

Respond with JSON only, no other text. Format:
{
  "content": "The full LinkedIn post text here...",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "bestTime": "Tuesday 8-9 AM EST"
}`;
}

export function buildVariationPrompt(
  originalPost: string,
  originalLength: PostLength,
  originalTone: PostTone,
  newLength: PostLength,
  newTone: PostTone
): string {
  const lengthGuide = {
    short: "around 500 characters (concise and punchy)",
    medium: "around 1500 characters (balanced depth)",
    long: "around 2500 characters (comprehensive)",
  };

  const toneGuide = {
    professional:
      "Professional and authoritative - use industry terminology appropriately, maintain credibility",
    conversational:
      "Conversational and relatable - write like you're talking to a colleague, use contractions",
    storytelling:
      "Storytelling - use narrative techniques, paint pictures with words, build emotional connection",
    "thought-leader":
      "Thought-leader - challenge assumptions, share unique perspectives, inspire action",
  };

  const changes: string[] = [];
  if (newLength !== originalLength) {
    changes.push(`Change length from ${originalLength} to ${newLength}`);
  }
  if (newTone !== originalTone) {
    changes.push(`Change tone from ${originalTone} to ${newTone}`);
  }

  return `You are a LinkedIn content writer creating a variation of an existing post.

ORIGINAL POST:
${originalPost}

REQUESTED CHANGES:
${changes.map((c) => `- ${c}`).join("\n")}

NEW REQUIREMENTS:
- Length: ${lengthGuide[newLength]}
- Tone: ${toneGuide[newTone]}
- Keep the core message and key points
- Maintain the hook-body-CTA structure
- Update hashtags if the tone/angle shifts significantly

Respond with JSON only, no other text. Format:
{
  "content": "The full LinkedIn post text here...",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "bestTime": "Tuesday 8-9 AM EST"
}`;
}
