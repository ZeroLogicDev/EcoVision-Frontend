import { cn } from '@/utils/cn';
import { getConfidenceColor } from '@/utils/formatConfidence';

/**
 * ConfidenceMeter — visual confidence bar with percentage.
 */
export default function ConfidenceMeter({ value = 0, showLabel = true, size = 'md', className }) {
  const percent = Math.round(value * 100);
  const color = getConfidenceColor(value);

  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2.5' };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex-1 rounded-full bg-surface-300 overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', {
            'bg-neon-500': value >= 0.8,
            'bg-yellow-400': value >= 0.5 && value < 0.8,
            'bg-red-400': value < 0.5,
          })}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn('text-xs font-mono font-bold tabular-nums', color)}>
          {percent}%
        </span>
      )}
    </div>
  );
}
