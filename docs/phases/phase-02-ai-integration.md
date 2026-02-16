# Phase 2: AI Integration

**Status**: ✅ Complete
**Completion**: 100%

## Goal
Create Claude API integration with prompt templates and API routes for generating ideas, drafts, and variations.

## Tasks

### 2A: Anthropic Client Setup
- Create Anthropic client wrapper
- Handle API key from environment
- Add error handling and retry logic
- Create type-safe response parsing

### 2B: Prompt Templates
Design prompts for:

**Idea Generation**
- Input: Article text or topic
- Output: 3-5 unique post ideas with titles and descriptions
- Include diverse angles (how-to, opinion, story, data-driven, question)

**Draft Generation**
- Input: Selected idea + original context
- Output: Full LinkedIn post
- Include: Hook, body, call-to-action, hashtags (5-7), best posting time

**Variation Generation**
- Input: Base draft + variation parameters
- Output: Modified version with specified length/tone
- Length options: short (~500 chars), medium (~1500 chars), long (~2500 chars)
- Tone options: professional, conversational, storytelling, thought-leader

### 2C: API Routes
Create Next.js API routes:

**POST /api/ideas**
- Request: `{ type: 'article' | 'topic', content: string }`
- Response: `{ ideas: Idea[] }`
- Saves input and ideas to database

**POST /api/drafts**
- Request: `{ ideaId: string }`
- Response: `{ post: Post }`
- Generates default (medium/professional) draft

**POST /api/variations**
- Request: `{ postId: string, length: string, tone: string }`
- Response: `{ post: Post }`
- Generates variation and saves to database

## Files to Create
- `src/lib/anthropic.ts` - Claude API client wrapper
- `src/lib/prompts.ts` - Prompt template functions
- `src/app/api/ideas/route.ts` - Ideas endpoint
- `src/app/api/drafts/route.ts` - Drafts endpoint
- `src/app/api/variations/route.ts` - Variations endpoint

## Success Criteria
- [x] API routes return valid JSON responses
- [x] Ideas are relevant and diverse
- [x] Drafts include hashtags and posting time
- [x] Variations correctly apply length/tone
- [x] All content saved to database
- [x] Proper error handling for API failures
