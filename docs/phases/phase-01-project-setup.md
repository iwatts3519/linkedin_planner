# Phase 1: Project Setup & Database

**Status**: ✅ Complete
**Completion**: 100%

## Goal
Initialize Next.js project with TypeScript, Tailwind CSS, and SQLite database with complete schema for storing inputs, ideas, and generated posts.

## Tasks

### 1A: Project Initialization
- Initialize Next.js 14 with App Router
- Configure TypeScript (strict mode)
- Set up Tailwind CSS
- Configure ESLint and Prettier

### 1B: Dependencies
Install required packages:
```bash
npm install @anthropic-ai/sdk better-sqlite3 zod
npm install -D @types/better-sqlite3
```

### 1C: Database Schema
Create SQLite database with tables:

**inputs**
- `id` - Primary key
- `type` - 'article' | 'topic'
- `content` - The pasted article or topic text
- `created_at` - Timestamp

**ideas**
- `id` - Primary key
- `input_id` - Foreign key to inputs
- `title` - Idea headline
- `description` - Brief description of the angle
- `created_at` - Timestamp

**posts**
- `id` - Primary key
- `idea_id` - Foreign key to ideas
- `content` - Generated post text
- `length` - 'short' | 'medium' | 'long'
- `tone` - 'professional' | 'conversational' | 'storytelling' | 'thought-leader'
- `hashtags` - JSON array of hashtags
- `best_time` - Suggested posting time
- `created_at` - Timestamp

### 1D: Database Utilities
Create helper functions for:
- Database connection
- CRUD operations for each table
- Type-safe query results

## Files to Create
- `src/lib/db.ts` - Database connection and queries
- `src/lib/schema.sql` - SQL schema definition
- `src/types/index.ts` - TypeScript types for all entities
- `.env.local` - Environment variables (gitignored)
- `.env.example` - Example env file for documentation

## Success Criteria
- [x] `npm run dev` starts without errors
- [x] `npm run typecheck` passes
- [x] Database file created at `data/linkedin.db`
- [x] All TypeScript types defined and exported
- [x] Schema applied successfully
