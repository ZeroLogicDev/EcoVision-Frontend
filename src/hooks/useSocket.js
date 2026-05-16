import { useEffect, useRef, useCallback } from 'react';
import { useDetectionStore } from '@/store/detectionStore';

const WS_URL = import.meta.env.VITE_AI_WS_URL;

/**
 * Hook for direct WebSocket connection to FastAPI AI engine.
 * Opsi B architecture: Frontend → WebSocket → FastAPI (bypass Node.js).
 */
export function useSocket() {
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const reconnectAttempt = useRef(0);
  const MAX_RECONNECT = 5;

  const { setConnectionStatus, setDetections, setLatency } = useDetectionStore.getState();

  const connect = useCallback(() => {
    if (!WS_URL) {
      console.warn('[useSocket] VITE_AI_WS_URL belum di-set');
      setConnectionStatus('error');
      return;
    }

    setConnectionStatus('connecting');
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[useSocket] Connected to AI engine');
      setConnectionStatus('connected');
      reconnectAttempt.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.detections) {
          setDetections(data.detections);
        }
        if (data.latency) {
          setLatency(data.latency);
        }
      } catch (err) {
        console.warn('[useSocket] Parse error:', err);
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      wsRef.current = null;

      // Auto-reconnect with exponential backoff
      if (reconnectAttempt.current < MAX_RECONNECT) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempt.current), 30000);
        reconnectTimer.current = setTimeout(() => {
          reconnectAttempt.current++;
          connect();
        }, delay);
      }
    };

    ws.onerror = () => {
      setConnectionStatus('error');
    };
  }, []);

  const disconnect = useCallback(() => {
    clearTimeout(reconnectTimer.current);
    reconnectAttempt.current = MAX_RECONNECT; // Prevent auto-reconnect
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus('disconnected');
  }, []);

  const sendFrame = useCallback((base64Frame) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        frame: base64Frame,
        timestamp: Date.now(),
      }));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { connect, disconnect, sendFrame };
}
