'use client';

import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className = '' }: ErrorMessageProps) {
  return (
    <div
      className={`
        flex flex-col items-center gap-5 p-6 sm:p-8
        bg-gradient-to-br from-error/5 to-error/10
        border-2 border-error/20 rounded-2xl
        text-center
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-error/10">
        <svg
          className="h-7 w-7 text-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-error">Something went wrong</h3>
        <p className="text-ink-600 text-sm max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </Button>
      )}
    </div>
  );
}
