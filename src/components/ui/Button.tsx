'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    btn-gradient text-white font-semibold
    shadow-[--shadow-md] hover:shadow-[--shadow-lg]
    disabled:opacity-50 disabled:cursor-not-allowed
    focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2
  `,
  secondary: `
    bg-white text-ink-700 font-medium
    border border-ink-200 hover:border-ink-300
    hover:bg-ink-50 hover:text-ink-900
    shadow-[--shadow-sm] hover:shadow-[--shadow-md]
    focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2
  `,
  ghost: `
    bg-transparent text-ink-600 font-medium
    hover:bg-ink-100 hover:text-ink-800
    focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-7 py-3.5 text-lg rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          relative inline-flex items-center justify-center gap-2.5
          transition-all duration-200 ease-out
          disabled:cursor-not-allowed
          active:scale-[0.98]
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        <span className={loading ? 'opacity-0' : 'relative z-10'}>
          {children}
        </span>
      </button>
    );
  }
);
