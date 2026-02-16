'use client';

import { IdeaCard } from './IdeaCard';
import type { Idea } from '@/types';

interface IdeaListProps {
  ideas: Idea[];
  selectedIdea?: Idea | null;
  onSelectIdea?: (idea: Idea) => void;
  loading?: boolean;
}

function IdeaSkeleton({ index }: { index: number }) {
  return (
    <div
      className="p-5 sm:p-6 rounded-2xl border-2 border-ink-200 bg-white animate-fade-up opacity-0"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start gap-4">
        <div className="w-6 h-6 rounded-full animate-shimmer" />
        <div className="flex-1 space-y-3">
          <div className="h-5 animate-shimmer rounded-lg w-3/4" />
          <div className="space-y-2">
            <div className="h-4 animate-shimmer rounded-lg w-full" />
            <div className="h-4 animate-shimmer rounded-lg w-2/3" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg animate-shimmer" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 px-4 animate-fade-up">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ink-100 mb-5">
        <svg
          className="w-8 h-8 text-ink-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
          />
        </svg>
      </div>
      <h3 className="font-display text-xl text-ink-900 mb-2">No ideas yet</h3>
      <p className="text-ink-500 max-w-xs mx-auto">
        Enter an article or topic above to generate post ideas
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="relative flex items-center justify-center w-8 h-8">
          <div className="absolute inset-0 rounded-full border-2 border-coral-200" />
          <div className="absolute inset-0 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
        </div>
        <span className="text-sm font-medium text-ink-600">
          Generating ideas<span className="animate-pulse">...</span>
        </span>
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <IdeaSkeleton key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

export function IdeaList({ ideas, selectedIdea, onSelectIdea, loading = false }: IdeaListProps) {
  if (loading) {
    return <LoadingState />;
  }

  if (ideas.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-ink-500">
        Select an idea to generate a full draft
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
          {ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'}
        </span>
      </p>
      <div className="space-y-3">
        {ideas.map((idea, index) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            selected={selectedIdea?.id === idea.id}
            onSelect={onSelectIdea}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
