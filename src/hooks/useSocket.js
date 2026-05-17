import { useEffect, useRef, useCallback } from 'react';
import { useDetectionStore } from '@/store/detectionStore';

const WS_URL = import.meta.env.VITE_AI_WS_URL;

/**
 * Hook for direct WebSocket connection to FastAPI AI engine.
 * Sends raw binary JPEG frames (no base64 overhead).
 */
export function useSocket() {
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const reconnectAttempt = useRef(0);
  const keepAliveTimer = useRef(null);
  const MAX_RECONNECT = 5;

  const { setConnectionStatus, setDetections } = useDetectionStore.getState();

  const connect = useCallback(() => {
    if (!WS_URL) {
      console.warn('[useSocket] VITE_AI_WS_URL belum di-set');
      setConnectionStatus('error');
      return;
    }

    setConnectionStatus('connecting');
    const ws = new WebSocket(WS_URL);
    ws.binaryType = 'arraybuffer'; // ← Expect binary responses if needed
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[useSocket] Connected to AI engine');
      setConnectionStatus('connected');
      reconnectAttempt.current = 0;

      // Keep-alive ping every 25s to prevent HF cold sleep
      keepAliveTimer.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(new Uint8Array([0])); // 1-byte ping
        }
      }, 25000);
    };

    ws.onmessage = (event) => {
      try {
        // Response is always JSON text
        const data = typeof event.data === 'string'
          ? JSON.parse(event.data)
          : JSON.parse(new TextDecoder().decode(event.data));

        if (data.detections) {
          setDetections(data.detections);
        }
      } catch (err) {
        // Ignore ping/pong responses
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
      wsRef.current = null;
      clearInterval(keepAliveTimer.current);

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
    clearInterval(keepAliveTimer.current);
    reconnectAttempt.current = MAX_RECONNECT;
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus('disconnected');
  }, []);

  // Send raw binary JPEG blob — no base64, no JSON wrapper
  const sendFrame = useCallback((blob) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(blob); // ← Send Blob directly as binary
    }
  }, []);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { connect, disconnect, sendFrame };
}
