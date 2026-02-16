'use client';

import { Button } from './ui/Button';
import type { PostLength, PostTone } from '@/types';

interface VariationSelectorProps {
  length: PostLength;
  tone: PostTone;
  onLengthChange: (length: PostLength) => void;
  onToneChange: (tone: PostTone) => void;
  onGenerate: () => void;
  loading?: boolean;
}

const LENGTH_OPTIONS: { value: PostLength; label: string; description: string; icon: string }[] = [
  { value: 'short', label: 'Short', description: '~500 chars', icon: 'S' },
  { value: 'medium', label: 'Medium', description: '~1500 chars', icon: 'M' },
  { value: 'long', label: 'Long', description: '~2500 chars', icon: 'L' },
];

const TONE_OPTIONS: { value: PostTone; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Formal and authoritative' },
  { value: 'conversational', label: 'Conversational', description: 'Friendly and approachable' },
  { value: 'storytelling', label: 'Storytelling', description: 'Narrative and engaging' },
  { value: 'thought-leader', label: 'Thought Leader', description: 'Insightful and visionary' },
];

export function VariationSelector({
  length,
  tone,
  onLengthChange,
  onToneChange,
  onGenerate,
  loading = false,
}: VariationSelectorProps) {
  return (
    <div className="bg-white rounded-2xl border-2 border-ink-200 shadow-[--shadow-sm] overflow-hidden">
      {/* Length Selection */}
      <div className="p-5 sm:p-6 border-b border-ink-100">
        <label className="block text-sm font-semibold text-ink-700 mb-4">
          Post Length
        </label>
        <div className="grid grid-cols-3 gap-3">
          {LENGTH_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onLengthChange(option.value)}
              className={`
                group relative p-4 rounded-xl border-2
                transition-all duration-200 ease-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2
                ${length === option.value
                  ? 'border-coral-400 bg-coral-50 shadow-[--shadow-md]'
                  : 'border-ink-200 bg-white hover:border-coral-300 hover:bg-ink-50'
                }
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-lg mb-3 flex items-center justify-center
                  text-sm font-bold transition-colors
                  ${length === option.value
                    ? 'bg-coral-500 text-white'
                    : 'bg-ink-100 text-ink-500 group-hover:bg-coral-100 group-hover:text-coral-600'
                  }
                `}
              >
                {option.icon}
              </div>
              <div className="text-left">
                <div
                  className={`
                    font-semibold text-sm transition-colors
                    ${length === option.value ? 'text-coral-900' : 'text-ink-800'}
                  `}
                >
                  {option.label}
                </div>
                <div
                  className={`
                    text-xs mt-0.5 transition-colors
                    ${length === option.value ? 'text-coral-600' : 'text-ink-500'}
                  `}
                >
                  {option.description}
                </div>
              </div>
              {/* Selection indicator */}
              {length === option.value && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 rounded-full bg-coral-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selection */}
      <div className="p-5 sm:p-6 border-b border-ink-100 bg-ink-50/30">
        <label className="block text-sm font-semibold text-ink-700 mb-4">
          Writing Tone
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TONE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onToneChange(option.value)}
              className={`
                group flex items-start gap-3 p-4 rounded-xl border-2 text-left
                transition-all duration-200 ease-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2
                ${tone === option.value
                  ? 'border-coral-400 bg-coral-50 shadow-[--shadow-md]'
                  : 'border-ink-200 bg-white hover:border-coral-300 hover:bg-white'
                }
              `}
            >
              <div
                className={`
                  flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2
                  transition-all duration-200 flex items-center justify-center
                  ${tone === option.value
                    ? 'border-coral-500 bg-coral-500'
                    : 'border-ink-300 bg-white group-hover:border-coral-400'
                  }
                `}
              >
                {tone === option.value && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`
                    font-semibold text-sm transition-colors
                    ${tone === option.value ? 'text-coral-900' : 'text-ink-800'}
                  `}
                >
                  {option.label}
                </div>
                <div
                  className={`
                    text-xs mt-0.5 transition-colors
                    ${tone === option.value ? 'text-coral-600' : 'text-ink-500'}
                  `}
                >
                  {option.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-ink-50/50 to-coral-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-ink-600">
            <span className="font-medium text-ink-800">{LENGTH_OPTIONS.find(o => o.value === length)?.label}</span>
            {' '}&middot;{' '}
            <span className="font-medium text-ink-800">{TONE_OPTIONS.find(o => o.value === tone)?.label}</span>
          </div>
          <Button onClick={onGenerate} loading={loading} size="lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Generate Draft
          </Button>
        </div>
      </div>
    </div>
  );
}
