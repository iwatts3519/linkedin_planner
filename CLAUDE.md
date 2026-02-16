# LinkedIn Assistant

Web app for creating engaging LinkedIn content. Users paste topics or articles, and AI helps identify posting opportunities and generates suggested copy.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Database**: Local SQLite
- **Auth**: TBD

## Commands
```bash
npm run dev          # Dev server at localhost:3000
npm run build        # Production build
npm run typecheck    # TypeScript check - RUN AFTER CODE CHANGES
npm run lint         # ESLint
npm run test         # Vitest tests
```

**Before committing**: Always run `npm run typecheck && npm run lint && npm run test`

## Project Structure
```
src/
├── app/                 # Next.js App Router
├── components/          # React components
├── lib/                 # Utilities and helpers
├── hooks/               # Custom React hooks
├── stores/              # Zustand stores
└── types/               # TypeScript types
```

## Code Style

### TypeScript
- Strict mode - no `any` types
- Zod schemas for all validation
- Type imports: `import type { X } from 'y'`

### React/Next.js
- Server Components by default
- `'use client'` only when needed (hooks, browser APIs, interactivity)
- Named exports for components

### File Naming
- Components: `PascalCase.tsx`
- Utilities/hooks: `camelCase.ts`
- Tests: `Component.test.tsx` (co-located)

### Tailwind
- Mobile-first: base → `sm:` → `md:` → `lg:`

### Import Order
1. React/Next.js
2. Third-party libs
3. Internal (`@/components`, `@/lib`)
4. Relative imports
5. Type imports

## Git
- **Repo**: https://github.com/iwatts3519/linkedin_planner.git
- **Branch**: `main`
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) - `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`

## Planning
- **PLAN.md** - Progress tracker and phase summaries
- **docs/phases/** - Detailed phase documentation

### Adding New Phases
1. Create `docs/phases/phase-NN-descriptive-name.md`
2. Update PLAN.md progress tracker with new row
3. Add brief summary to "Phase Summaries" section

### Phase File Template
```markdown
# Phase NN: Feature Name

**Status**: 📋 Planned
**Completion**: 0%

## Goal
Brief description of what this phase accomplishes.

## Sub-Phases (if needed)
### Phase NNA: Sub-task
...

## Files to Create
- `path/to/file.ts` - Description

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

### Rules
- Major features get numbered phases (Phase 1, 2, 3...)
- No sub-numbering (no Phase 1.1, 1.2)
- Sub-phases use letters (Phase 7A, 7B, 7C)
- Keep PLAN.md under 300 lines - details go in phase files