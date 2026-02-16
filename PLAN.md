# LinkedIn Assistant - Development Plan

## Progress Tracker

| Phase | Description | Status | Completion |
|-------|-------------|--------|------------|
| 1 | Project Setup & Database | ✅ Complete | 100% |
| 2 | AI Integration | ✅ Complete | 100% |
| 3 | Core UI Components | ✅ Complete | 100% |
| 4 | Main Page & Flow | ✅ Complete | 100% |
| 5 | History & Polish | ✅ Complete | 100% |

**Status Key**: 📋 Planned | 🚧 In Progress | ✅ Complete

---

## Project Overview

Single-page web app for generating LinkedIn content. Users paste article text or enter topics, AI generates 3-5 post ideas, then full drafts with length/tone variations.

### Core Features
- **Input**: Paste article text OR enter topic/keyword
- **AI**: Anthropic Claude API for content generation
- **Output**: 3-5 ideas → drafts → variations (length + tone)
- **Extras**: Hashtag suggestions, posting times, character count
- **Storage**: SQLite database (save all history)
- **UI**: Single page app, clean minimal design

### Tech Stack
- Next.js 14+ (App Router), TypeScript, Tailwind CSS
- SQLite database (better-sqlite3)
- Anthropic Claude API (@anthropic-ai/sdk)
- No authentication (single user local tool)

---

## Phase Summaries

### Phase 1: Project Setup & Database
Initialize Next.js project, configure SQLite database with schema for inputs, ideas, and posts.
→ [Full details](docs/phases/phase-01-project-setup.md)

### Phase 2: AI Integration
Create Claude API client, prompt templates, and API routes for idea/draft generation.
→ [Full details](docs/phases/phase-02-ai-integration.md)

### Phase 3: Core UI Components
Build input form, idea cards, draft display, variation selector, and character count components.
→ [Full details](docs/phases/phase-03-ui-components.md)

### Phase 4: Main Page & Flow
Wire components together, implement state management, connect to API routes.
→ [Full details](docs/phases/phase-04-main-page.md)

### Phase 5: History & Polish
Add history sidebar, responsive design, and final UI polish.
→ [Full details](docs/phases/phase-05-history-polish.md)

---

## Environment Variables

```env
ANTHROPIC_API_KEY=your_api_key_here
```

## Dependencies

```bash
npm install @anthropic-ai/sdk better-sqlite3 zod
npm install -D @types/better-sqlite3
```
