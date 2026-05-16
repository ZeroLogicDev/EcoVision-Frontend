import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';
import Sidebar from '@/components/navigation/Sidebar';
import BottomNav from '@/components/navigation/BottomNav';

export default function AppLayout() {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-surface">
      {!isMobile && <Sidebar />}

      <main className={cn(
        'flex-1 min-h-screen',
        !isMobile && 'ml-64',
        isMobile && 'pb-20'
      )}>
        <Outlet />
      </main>

      {isMobile && <BottomNav />}
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
