'use client';

import { useState } from 'react';
import { CharacterCount } from './CharacterCount';
import { Button } from './ui/Button';
import type { Post } from '@/types';

interface DraftDisplayProps {
  post: Post;
  onHashtagClick?: (hashtag: string) => void;
}

export function DraftDisplay({ post, onHashtagClick }: DraftDisplayProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const textToCopy = `${post.content}\n\n${post.hashtags.map((h) => `#${h}`).join(' ')}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-ink-200 shadow-[--shadow-md] overflow-hidden animate-scale-in">
      {/* Post Content */}
      <div className="p-6 sm:p-8">
        <div className="prose-editorial">
          <p className="whitespace-pre-wrap text-ink-800 text-base sm:text-lg leading-relaxed">
            {post.content}
          </p>
        </div>
      </div>

      {/* Hashtags */}
      {post.hashtags.length > 0 && (
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 -mt-2">
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((hashtag) => (
              <button
                key={hashtag}
                type="button"
                onClick={() => onHashtagClick?.(hashtag)}
                className="
                  px-3 py-1.5 text-sm font-medium rounded-full
                  bg-teal-100 text-teal-700
                  hover:bg-teal-200 hover:text-teal-800
                  transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2
                "
              >
                #{hashtag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Character Count */}
      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
        <CharacterCount count={post.content.length} />
      </div>

      {/* Footer Actions */}
      <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-ink-50/80 to-teal-50/50 border-t border-ink-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Best Time Info */}
          {post.bestTime && (
            <div className="flex items-center gap-2.5 text-sm text-ink-600">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-ink-200 shadow-sm">
                <svg
                  className="w-4 h-4 text-coral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-ink-500">Best time to post:</span>
                <span className="ml-1.5 font-semibold text-ink-800">{post.bestTime}</span>
              </div>
            </div>
          )}

          {/* Copy Button */}
          <Button
            variant={copied ? 'ghost' : 'secondary'}
            size="md"
            onClick={handleCopy}
            className={`
              gap-2.5 min-w-[160px] justify-center
              ${copied ? 'bg-success/10 text-success border-success/20' : ''}
            `}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
