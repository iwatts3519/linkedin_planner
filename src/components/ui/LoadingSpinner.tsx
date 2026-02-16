interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'h-5 w-5',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} role="status">
      <div className={`relative ${sizeStyles[size]}`}>
        <div className="absolute inset-0 rounded-full border-2 border-ink-200" />
        <div className="absolute inset-0 rounded-full border-2 border-coral-500 border-t-transparent animate-spin" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
