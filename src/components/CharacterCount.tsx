interface CharacterCountProps {
  count: number;
  maxLength?: number;
  warningThreshold?: number;
}

const LINKEDIN_LIMIT = 3000;
const WARNING_THRESHOLD = 2700;

export function CharacterCount({
  count,
  maxLength = LINKEDIN_LIMIT,
  warningThreshold = WARNING_THRESHOLD,
}: CharacterCountProps) {
  const percentage = Math.min((count / maxLength) * 100, 100);
  const isWarning = count >= warningThreshold && count <= maxLength;
  const isOver = count > maxLength;

  let statusColor = 'bg-teal-500';
  let textColor = 'text-ink-600';
  let bgColor = 'bg-ink-100';

  if (isOver) {
    statusColor = 'bg-error';
    textColor = 'text-error font-semibold';
    bgColor = 'bg-error/10';
  } else if (isWarning) {
    statusColor = 'bg-warning';
    textColor = 'text-warning';
    bgColor = 'bg-warning/10';
  }

  return (
    <div className={`p-4 rounded-xl ${bgColor} space-y-2`}>
      {/* Progress Bar */}
      <div className="h-2 bg-white/60 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${statusColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Count Text */}
      <div className="flex justify-between items-center text-sm">
        <span className={textColor}>
          <span className="font-mono tabular-nums">{count.toLocaleString()}</span>
          <span className="text-ink-400 mx-1">/</span>
          <span className="font-mono tabular-nums">{maxLength.toLocaleString()}</span>
          <span className="text-ink-400 ml-1">characters</span>
        </span>
        {isOver && (
          <span className="inline-flex items-center gap-1 text-error text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {(count - maxLength).toLocaleString()} over limit
          </span>
        )}
        {isWarning && (
          <span className="text-warning text-xs font-medium">
            {(maxLength - count).toLocaleString()} remaining
          </span>
        )}
        {!isOver && !isWarning && (
          <span className="text-teal-600 text-xs font-medium flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Good length
          </span>
        )}
      </div>
    </div>
  );
}
