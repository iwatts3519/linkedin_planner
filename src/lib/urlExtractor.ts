import * as cheerio from "cheerio";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_CHARS_PER_ARTICLE = 8_000;

interface ExtractionResult {
  combinedText: string;
  errors: Array<{ url: string; error: string }>;
}

function extractText(html: string): string {
  const $ = cheerio.load(html);

  // Remove non-content elements
  $("script, style, nav, footer, header, aside, iframe, noscript, svg, form, [role='navigation'], [role='banner'], [role='contentinfo'], .ad, .ads, .advertisement, .sidebar, .nav, .menu, .footer, .header").remove();

  // Try semantic content selectors first
  const selectors = ["article", "[role='main']", "main", ".post-content", ".article-body", ".entry-content"];
  for (const selector of selectors) {
    const el = $(selector);
    if (el.length > 0) {
      const text = el.text().replace(/\s+/g, " ").trim();
      if (text.length > 200) {
        return text.slice(0, MAX_CHARS_PER_ARTICLE);
      }
    }
  }

  // Fallback to body
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  return bodyText.slice(0, MAX_CHARS_PER_ARTICLE);
}

async function fetchUrl(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkedInAssistant/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      throw new Error(`Unsupported content type: ${contentType}`);
    }

    const html = await response.text();
    const text = extractText(html);

    if (text.length < 50) {
      throw new Error("Could not extract meaningful content from the page");
    }

    return text;
  } finally {
    clearTimeout(timeout);
  }
}

export async function extractFromUrls(urls: string[]): Promise<ExtractionResult> {
  const results = await Promise.allSettled(
    urls.map(async (url) => ({
      url,
      text: await fetchUrl(url),
    }))
  );

  const texts: string[] = [];
  const errors: ExtractionResult["errors"] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const url = urls[i];
    if (result.status === "fulfilled") {
      texts.push(`--- Content from ${url} ---\n${result.value.text}`);
    } else {
      const message = result.reason instanceof Error ? result.reason.message : "Unknown error";
      errors.push({ url, error: message });
    }
  }

  const combinedText = texts.join("\n\n");

  return { combinedText, errors };
}
