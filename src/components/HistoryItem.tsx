'use client';

import { useState } from 'react';
import type { HistoryEntry } from '@/lib/db';

interface HistoryItemProps {
  entry: HistoryEntry;
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: number) => void;
  index?: number;
}

export function HistoryItem({ entry, onSelect, onDelete, index = 0 }: HistoryItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const preview = entry.type === 'url' && entry.sourceUrls
    ? entry.sourceUrls.join(', ')
    : entry.content.length > 100
      ? entry.content.slice(0, 100) + '...'
      : entry.content;

  const date = new Date(entry.createdAt);
  const formattedDate = date.toLocaleString('en-GB', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  });

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (showConfirm) {
      onDelete(entry.id);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  }

  function handleCancelDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setShowConfirm(false);
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className="
        group w-full text-left p-4 rounded-xl border-2 border-ink-200 bg-white
        hover:border-coral-300 hover:shadow-[--shadow-md]
        transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2
        animate-fade-up opacity-0
      "
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Type badge */}
          <span className={`
            inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg mb-2
            ${entry.type === 'article'
              ? 'bg-coral-100 text-coral-700'
              : entry.type === 'url'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-teal-100 text-teal-700'
            }
          `}>
            {entry.type === 'article' ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ) : entry.type === 'url' ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            )}
            {entry.type}
          </span>

          {/* Preview */}
          <p className="text-sm text-ink-700 leading-relaxed line-clamp-2 group-hover:text-ink-800">
            {preview}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 text-xs text-ink-500">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-ink-500">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {entry.ideaCount} {entry.ideaCount === 1 ? 'idea' : 'ideas'}
            </span>
          </div>
        </div>

        {/* Delete button */}
        <div className="flex-shrink-0">
          {showConfirm ? (
            <div className="flex items-center gap-1.5 bg-error/5 rounded-lg p-1">
              <button
                type="button"
                onClick={handleDelete}
                className="px-2.5 py-1.5 text-xs font-semibold text-white bg-error hover:bg-error/90 rounded-md transition-colors"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-2.5 py-1.5 text-xs font-medium text-ink-600 hover:text-ink-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDelete}
              className="
                p-2 rounded-lg
                text-ink-400 hover:text-error hover:bg-error/10
                transition-all duration-200
                opacity-0 group-hover:opacity-100
              "
              aria-label="Delete"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </button>
  );
}
