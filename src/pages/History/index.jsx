import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '@/hooks/useIsMobile';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const HistoryDesktop = lazy(() => import('./HistoryDesktop'));
const HistoryMobile = lazy(() => import('./HistoryMobile'));

export default function History() {
  const isMobile = useIsMobile();
  return (
    <>
      <Helmet><title>Riwayat — EcoVision</title></Helmet>
      <Suspense fallback={<LoadingSpinner />}>
        {isMobile ? <HistoryMobile /> : <HistoryDesktop />}
      </Suspense>
    </>
  );
}
