import { useEffect } from 'react';
import { useDetectionStore } from '@/store/detectionStore';
import scanService from '@/services/scanService';

/**
 * Hook to periodically check AI engine health.
 */
export function useServiceHealth() {
  const { aiStatus, setAiStatus } = useDetectionStore();

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      try {
        const result = await scanService.checkHealth();
        if (isMounted) setAiStatus(result.status);
      } catch {
        if (isMounted) setAiStatus('error');
      }
    }

    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [setAiStatus]);

  return { aiStatus };
}
