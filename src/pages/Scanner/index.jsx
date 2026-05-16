import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '@/hooks/useIsMobile';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ScannerDesktop = lazy(() => import('./ScannerDesktop'));
const ScannerMobile = lazy(() => import('./ScannerMobile'));

export default function Scanner() {
  const isMobile = useIsMobile();

  return (
    <>
      <Helmet><title>Scanner — EcoVision</title></Helmet>
      <Suspense fallback={<LoadingSpinner />}>
        {isMobile ? <ScannerMobile /> : <ScannerDesktop />}
      </Suspense>
    </>
  );
}
