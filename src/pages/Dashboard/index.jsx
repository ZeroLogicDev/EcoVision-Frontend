import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '@/hooks/useIsMobile';
import { DashboardSkeleton } from '@/components/ui/SkeletonLoader';

const DashboardDesktop = lazy(() => import('./DashboardDesktop'));
const DashboardMobile = lazy(() => import('./DashboardMobile'));

export default function Dashboard() {
  const isMobile = useIsMobile();

  return (
    <>
      <Helmet><title>Dashboard — EcoVision</title></Helmet>
      <Suspense fallback={<DashboardSkeleton />}>
        {isMobile ? <DashboardMobile /> : <DashboardDesktop />}
      </Suspense>
    </>
  );
}
