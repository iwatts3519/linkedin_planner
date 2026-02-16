'use client';

import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from './HistoryItem';
import type { HistoryEntry } from '@/lib/db';

interface HistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntry: (entry: HistoryEntry) => void;
}

interface HistoryResponse {
  history: HistoryEntry[];
  total: number;
  hasMore: boolean;
}

export function History({ isOpen, onClose, onSelectEntry }: HistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/history');
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data: HistoryResponse = await response.json();
      setEntries(data.history);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, fetchHistory]);

  async function handleDelete(id: number) {
    try {
      const response = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete');
      }
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  }

  function handleSelect(entry: HistoryEntry) {
    onSelectEntry(entry);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-ink-950/30 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-full max-w-md
          bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100 bg-gradient-to-r from-white to-ink-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-ink-900 text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl text-ink-900">History</h2>
              <p className="text-sm text-ink-500">Your recent content</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="
              p-2.5 text-ink-400 hover:text-ink-600
              rounded-xl hover:bg-ink-100
              transition-colors duration-200
            "
            aria-label="Close history"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto h-[calc(100%-88px)]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-ink-200" />
                <div className="absolute inset-0 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
              </div>
              <p className="mt-4 text-sm text-ink-500">Loading history...</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-error/10 mb-4">
                <svg className="w-7 h-7 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-error font-medium mb-2">{error}</p>
              <button
                onClick={fetchHistory}
                className="text-sm font-medium text-coral-600 hover:text-coral-700 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ink-100 mb-5">
                <svg className="w-8 h-8 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-lg text-ink-900 mb-2">No history yet</h3>
              <p className="text-ink-500 text-sm max-w-xs mx-auto">
                Your generated content will appear here for easy access
              </p>
            </div>
          )}

          {!loading && !error && entries.length > 0 && (
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <HistoryItem
                  key={entry.id}
                  entry={entry}
                  onSelect={handleSelect}
                  onDelete={handleDelete}
                  index={index}
                />
              ))}

              {hasMore && (
                <div className="text-center py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-100 text-ink-500 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    Showing first 50 entries
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
