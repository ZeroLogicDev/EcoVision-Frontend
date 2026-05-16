import { cn } from '@/utils/cn';

const VARIANTS = {
  online: { dot: 'bg-neon-500', text: 'text-neon-500', bg: 'bg-neon-500/10', label: 'Online' },
  offline: { dot: 'bg-white/30', text: 'text-white/30', bg: 'bg-white/5', label: 'Offline' },
  live: { dot: 'bg-red-500 animate-pulse', text: 'text-red-400', bg: 'bg-red-500/10', label: 'Live' },
  success: { dot: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Berhasil' },
  warning: { dot: 'bg-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Peringatan' },
  error: { dot: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10', label: 'Error' },
};

/**
 * StatusBadge — reusable status indicator pill.
 */
export default function StatusBadge({ variant = 'online', label, className }) {
  const config = VARIANTS[variant] || VARIANTS.offline;
  const displayLabel = label || config.label;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium', config.bg, config.text, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {displayLabel}
    </span>
  );
}
