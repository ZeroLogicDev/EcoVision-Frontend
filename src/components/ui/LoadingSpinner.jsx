import { cn } from '@/utils/cn';

export default function LoadingSpinner({ size = 'md', className }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className={cn('flex items-center justify-center min-h-screen bg-surface', className)}>
      <div className="flex flex-col items-center gap-4">
        <div className={cn('border-2 border-surface-400 border-t-neon-500 rounded-full animate-spin', sizes[size])} />
        <p className="text-sm text-white/40 font-mono">Memuat...</p>
      </div>
    </div>
  );
}
