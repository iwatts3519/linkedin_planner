# Phase 6: URL-Based Content Input

**Status**: ✅ Complete
**Completion**: 100%

## Goal
Allow users to paste 1-5 URLs as a third input type, have the server fetch and extract article content, and feed that to Claude for idea generation.

## Changes

### Types (`src/types/index.ts`)
- Added `"url"` to `InputTypeSchema` enum
- Added `sourceUrls` field to `InputSchema` and `CreateInputSchema`
- Added `UrlInputSchema` for validating URL submissions (1-5 valid URLs)

### Database (`src/lib/schema.sql`, `src/lib/db.ts`)
- Added `source_urls TEXT DEFAULT NULL` column to `inputs` table
- Migration rebuilds existing `inputs` table to update CHECK constraint (`type IN ('article', 'topic', 'url')`)
- `createInput()` stores `sourceUrls` as JSON
- All read operations (`getInputById`, `getAllInputs`, `getHistory`) parse `source_urls` back to array
- `HistoryEntry` type includes `sourceUrls`

### URL Extractor (`src/lib/urlExtractor.ts`) — new file
- `extractFromUrls(urls)` fetches all URLs in parallel via `Promise.allSettled`
- 10s timeout per URL, strips non-content HTML (script, style, nav, ads, footer, etc.)
- Tries semantic selectors (`article`, `main`, `[role='main']`) before falling back to `body`
- Truncates each article to ~8000 chars
- Returns combined text + per-URL errors for partial failure reporting

### Prompts (`src/lib/prompts.ts`)
- Added `"url"` branch to `buildIdeasPrompt` with web-article-specific context
- `buildDraftPrompt` handles `"url"` type label

### API Route (`src/app/api/ideas/route.ts`)
- Discriminated union request validation: article/topic send `content`, url sends `urls` array
- For URL type: calls `extractFromUrls()`, uses extracted text as content
- Returns `warnings` in response when some URLs fail but others succeed
- Returns 422 when all URLs fail

### Hook (`src/hooks/useContentGeneration.ts`)
- `submitInput` accepts optional `urls` parameter
- Sends `{ type: "url", urls }` body for URL submissions
- Surfaces partial-failure warnings via error state

### UI (`src/components/InputForm.tsx`)
- Third "URL" toggle button in input type selector
- Dynamic list of 1-5 URL text inputs with Add/Remove controls
- Per-input URL format validation (red border on invalid)
- Character counter hidden in URL mode, replaced with URL count indicator
- Link icon for URL toggle button

### History (`src/components/HistoryItem.tsx`)
- URL-type entries show source URLs instead of truncated extracted text
- Blue badge styling for URL type entries
- Link icon on URL type badge

### Tests (`src/lib/urlExtractor.test.ts`) — new file
- 7 unit tests covering: basic extraction, multiple URLs, partial failures, all-fail case, network errors, non-HTML content rejection, body fallback

## Files Created
- `src/lib/urlExtractor.ts`
- `src/lib/urlExtractor.test.ts`

## Files Modified
- `src/types/index.ts`
- `src/lib/schema.sql`
- `src/lib/db.ts`
- `src/lib/prompts.ts`
- `src/app/api/ideas/route.ts`
- `src/hooks/useContentGeneration.ts`
- `src/components/InputForm.tsx`
- `src/components/HistoryItem.tsx`
- `src/app/page.tsx`
- `package.json` (cheerio dependency)

## Success Criteria
- [x] `npm run typecheck` passes
- [x] `npm run lint` passes
- [x] `npm run test` passes (8 tests, 7 new)
- [x] Paste a URL, content is extracted and ideas are generated
- [x] Paste multiple URLs (including invalid), partial success with warning
- [x] History shows URL entries with source URLs displayed
- [x] Existing article/topic functionality unchanged
- [x] DB migration works for existing databases
