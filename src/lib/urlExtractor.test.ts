import { describe, it, expect, vi, beforeEach } from "vitest";
import { extractFromUrls } from "./urlExtractor";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

function htmlResponse(html: string) {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    headers: new Headers({ "content-type": "text/html; charset=utf-8" }),
    text: () => Promise.resolve(html),
  };
}

function errorResponse(status: number, statusText: string) {
  return {
    ok: false,
    status,
    statusText,
    headers: new Headers({ "content-type": "text/html" }),
    text: () => Promise.resolve(""),
  };
}

describe("extractFromUrls", () => {
  it("extracts text from a simple HTML page", async () => {
    const html = `
      <html>
        <head><title>Test</title></head>
        <body>
          <nav>Navigation</nav>
          <article>
            <h1>Test Article</h1>
            <p>${"This is meaningful article content. ".repeat(10)}</p>
          </article>
          <footer>Footer</footer>
        </body>
      </html>
    `;

    mockFetch.mockResolvedValueOnce(htmlResponse(html));

    const result = await extractFromUrls(["https://example.com/article"]);

    expect(result.errors).toHaveLength(0);
    expect(result.combinedText).toContain("Test Article");
    expect(result.combinedText).toContain("meaningful article content");
    // nav and footer content should be stripped
    expect(result.combinedText).not.toContain("Navigation");
    expect(result.combinedText).not.toContain("Footer");
  });

  it("handles multiple URLs", async () => {
    const html1 = `<html><body><article><p>${"First article content here. ".repeat(10)}</p></article></body></html>`;
    const html2 = `<html><body><article><p>${"Second article content here. ".repeat(10)}</p></article></body></html>`;

    mockFetch
      .mockResolvedValueOnce(htmlResponse(html1))
      .mockResolvedValueOnce(htmlResponse(html2));

    const result = await extractFromUrls([
      "https://example.com/one",
      "https://example.com/two",
    ]);

    expect(result.errors).toHaveLength(0);
    expect(result.combinedText).toContain("First article");
    expect(result.combinedText).toContain("Second article");
  });

  it("reports errors for failed URLs while returning successful ones", async () => {
    const html = `<html><body><article><p>${"Good article content here. ".repeat(10)}</p></article></body></html>`;

    mockFetch
      .mockResolvedValueOnce(htmlResponse(html))
      .mockResolvedValueOnce(errorResponse(404, "Not Found"));

    const result = await extractFromUrls([
      "https://example.com/good",
      "https://example.com/bad",
    ]);

    expect(result.combinedText).toContain("Good article");
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].url).toBe("https://example.com/bad");
    expect(result.errors[0].error).toContain("404");
  });

  it("returns empty text when all URLs fail", async () => {
    mockFetch
      .mockResolvedValueOnce(errorResponse(500, "Server Error"))
      .mockResolvedValueOnce(errorResponse(403, "Forbidden"));

    const result = await extractFromUrls([
      "https://example.com/fail1",
      "https://example.com/fail2",
    ]);

    expect(result.combinedText).toBe("");
    expect(result.errors).toHaveLength(2);
  });

  it("handles fetch network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await extractFromUrls(["https://example.com/offline"]);

    expect(result.combinedText).toBe("");
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toBe("Network error");
  });

  it("rejects non-HTML content types", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers({ "content-type": "application/pdf" }),
      text: () => Promise.resolve("PDF content"),
    });

    const result = await extractFromUrls(["https://example.com/file.pdf"]);

    expect(result.combinedText).toBe("");
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toContain("Unsupported content type");
  });

  it("falls back to body when no semantic elements found", async () => {
    const html = `<html><body><div><p>${"Fallback body content here for testing. ".repeat(10)}</p></div></body></html>`;

    mockFetch.mockResolvedValueOnce(htmlResponse(html));

    const result = await extractFromUrls(["https://example.com/simple"]);

    expect(result.errors).toHaveLength(0);
    expect(result.combinedText).toContain("Fallback body content");
  });
});
