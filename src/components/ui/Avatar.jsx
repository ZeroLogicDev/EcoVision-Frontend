import { cn } from '@/utils/cn';

/**
 * Avatar — user avatar with initial fallback.
 */
export default function Avatar({ src, name = '', size = 'md', className }) {
  const initial = name?.[0]?.toUpperCase() || '?';

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-2xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover shrink-0', sizes[size], className)}
      />
    );
  }

  return (
    <div className={cn(
      'rounded-full bg-gradient-to-br from-neon-500 to-neon-700 flex items-center justify-center text-surface font-bold shrink-0',
      sizes[size],
      className,
    )}>
      {initial}
    </div>
  );
}
