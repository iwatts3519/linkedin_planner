'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from './ui/Button';
import type { InputType } from '@/types';

interface InputFormProps {
  onSubmit: (type: InputType, content: string) => void;
  loading?: boolean;
}

const MAX_ARTICLE_LENGTH = 10000;
const MAX_TOPIC_LENGTH = 200;

export function InputForm({ onSubmit, loading = false }: InputFormProps) {
  const [inputType, setInputType] = useState<InputType>('article');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const maxLength = inputType === 'article' ? MAX_ARTICLE_LENGTH : MAX_TOPIC_LENGTH;
  const characterCount = content.length;
  const isOverLimit = characterCount > maxLength;
  const percentUsed = Math.min((characterCount / maxLength) * 100, 100);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError(inputType === 'article' ? 'Please paste an article' : 'Please enter a topic');
      return;
    }

    if (isOverLimit) {
      setError(`Content exceeds ${maxLength.toLocaleString()} character limit`);
      return;
    }

    onSubmit(inputType, trimmedContent);
  }

  function handleTypeChange(type: InputType) {
    setInputType(type);
    setContent('');
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Input Type Toggle */}
      <div className="inline-flex p-1 bg-ink-100 rounded-xl">
        <button
          type="button"
          onClick={() => handleTypeChange('article')}
          className={`
            relative px-5 py-2.5 text-sm font-semibold rounded-lg
            transition-all duration-300 ease-out
            ${inputType === 'article'
              ? 'text-ink-900 bg-white shadow-[--shadow-md]'
              : 'text-ink-500 hover:text-ink-700'
            }
          `}
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Article
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('topic')}
          className={`
            relative px-5 py-2.5 text-sm font-semibold rounded-lg
            transition-all duration-300 ease-out
            ${inputType === 'topic'
              ? 'text-ink-900 bg-white shadow-[--shadow-md]'
              : 'text-ink-500 hover:text-ink-700'
            }
          `}
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            Topic
          </span>
        </button>
      </div>

      {/* Content Input Card */}
      <div
        className={`
          relative bg-white rounded-2xl border-2 overflow-hidden
          shadow-[--shadow-sm] transition-all duration-300
          ${isFocused
            ? 'border-coral-400 shadow-[--shadow-glow]'
            : error || isOverLimit
              ? 'border-error/50'
              : 'border-ink-200 hover:border-ink-300'
          }
        `}
      >
        {/* Label */}
        <div className="px-5 pt-4 pb-2">
          <label
            htmlFor="content-input"
            className="block text-sm font-semibold text-ink-600"
          >
            {inputType === 'article' ? 'Paste your article' : 'Describe your topic'}
          </label>
        </div>

        {/* Input Area */}
        {inputType === 'article' ? (
          <textarea
            id="content-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Paste the article content you want to transform into LinkedIn posts..."
            rows={7}
            className="
              w-full px-5 py-2 text-ink-800 text-base leading-relaxed
              bg-transparent resize-none
              placeholder:text-ink-400
              focus:outline-none
            "
          />
        ) : (
          <input
            id="content-input"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="e.g., AI in healthcare, remote work trends, leadership..."
            className="
              w-full px-5 py-2 text-ink-800 text-base
              bg-transparent
              placeholder:text-ink-400
              focus:outline-none
            "
          />
        )}

        {/* Bottom Bar */}
        <div className="px-5 py-3 bg-ink-50/50 border-t border-ink-100">
          <div className="flex items-center justify-between gap-4">
            {/* Error Message */}
            <div className="flex-1 min-w-0">
              {error && (
                <p className="text-sm font-medium text-error flex items-center gap-1.5 animate-fade-in">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            {/* Character Count */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-24 h-1.5 bg-ink-200 rounded-full overflow-hidden">
                <div
                  className={`
                    h-full rounded-full transition-all duration-300
                    ${isOverLimit
                      ? 'bg-error'
                      : percentUsed > 80
                        ? 'bg-warning'
                        : 'bg-teal-500'
                    }
                  `}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
              <span className={`
                text-sm font-mono tabular-nums
                ${isOverLimit ? 'text-error font-semibold' : 'text-ink-500'}
              `}>
                {characterCount.toLocaleString()}/{maxLength.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={!content.trim() || isOverLimit}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate Ideas
        </Button>
        {content.trim() && !isOverLimit && !loading && (
          <span className="text-sm text-ink-400 animate-fade-in">
            Press Enter to submit
          </span>
        )}
      </div>
    </form>
  );
}
