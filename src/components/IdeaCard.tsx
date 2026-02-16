'use client';

import type { Idea } from '@/types';

interface IdeaCardProps {
  idea: Idea;
  selected?: boolean;
  onSelect?: (idea: Idea) => void;
  index?: number;
}

export function IdeaCard({ idea, selected = false, onSelect, index = 0 }: IdeaCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(idea)}
      className={`
        group w-full text-left p-5 sm:p-6 rounded-2xl border-2
        card-interactive
        focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2
        animate-fade-up opacity-0
        ${selected
          ? 'border-coral-400 bg-coral-50 shadow-[--shadow-lg]'
          : 'border-ink-200 bg-white hover:border-coral-300'
        }
      `}
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start gap-4">
        {/* Selection Indicator */}
        <div
          className={`
            relative flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2
            transition-all duration-300 ease-out
            flex items-center justify-center
            ${selected
              ? 'border-coral-500 bg-coral-500 scale-110'
              : 'border-ink-300 bg-white group-hover:border-coral-400'
            }
          `}
        >
          <svg
            className={`
              w-3.5 h-3.5 text-white transition-all duration-200
              ${selected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
            `}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              font-semibold text-base sm:text-lg leading-snug
              transition-colors duration-200
              ${selected ? 'text-coral-900' : 'text-ink-900 group-hover:text-coral-700'}
            `}
          >
            {idea.title}
          </h3>
          <p
            className={`
              mt-2 text-sm sm:text-base leading-relaxed
              transition-colors duration-200
              ${selected ? 'text-coral-700' : 'text-ink-600'}
            `}
          >
            {idea.description}
          </p>
        </div>

        {/* Arrow Icon */}
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-lg
            flex items-center justify-center
            transition-all duration-300
            ${selected
              ? 'bg-coral-500 text-white'
              : 'bg-ink-100 text-ink-400 group-hover:bg-coral-100 group-hover:text-coral-500'
            }
          `}
        >
          <svg
            className={`
              w-4 h-4 transition-transform duration-300
              ${selected ? 'rotate-0' : 'group-hover:translate-x-0.5'}
            `}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
