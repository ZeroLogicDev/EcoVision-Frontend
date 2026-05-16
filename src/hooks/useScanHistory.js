import { useState, useEffect, useCallback } from 'react';
import historyService from '@/services/historyService';

/**
 * Hook to fetch and manage scan history.
 */
export function useScanHistory(userId) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data } = await historyService.fetchHistory(userId);
      setHistory(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refetch: fetchHistory };
}
