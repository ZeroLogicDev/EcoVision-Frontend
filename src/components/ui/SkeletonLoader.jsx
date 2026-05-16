import { cn } from '@/utils/cn';

export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} />;
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
