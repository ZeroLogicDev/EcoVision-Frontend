import { useEffect, useRef, useCallback } from 'react';
import { useWebcam } from './useWebcam';
import { useSocket } from './useSocket';
import { useDetectionStore } from '@/store/detectionStore';
import { drawDetections, clearCanvas } from '@/utils/canvasHelper';

/**
 * Orchestrator hook — combines webcam + WebSocket + canvas drawing.
 * Implements backpressure + 10 FPS cap + round-trip latency tracking.
 */
export function useDetection() {
  const webcam = useWebcam();
  const socket = useSocket();
  const overlayCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const waitingRef = useRef(false);
  const sendTimeRef = useRef(0);        // ← Track when frame was sent
  const fpsWindowRef = useRef([]);       // ← Sliding window for accurate FPS

  const {
    isConnected,
    connectionStatus,
    detections,
    isStreaming,
    setIsStreaming,
    setFPS,
    setLatency,
    incrementFrameCount,
    resetDetections,
  } = useDetectionStore();

  const startLiveDetection = useCallback(async () => {
    await webcam.startCamera();
    socket.connect();
    setIsStreaming(true);
    waitingRef.current = false;
    fpsWindowRef.current = [];
  }, [webcam, socket, setIsStreaming]);

  const stopLiveDetection = useCallback(() => {
    setIsStreaming(false);
    webcam.stopCamera();
    socket.disconnect();
    resetDetections();
    waitingRef.current = false;
    fpsWindowRef.current = [];

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (overlayCanvasRef.current) {
      clearCanvas(overlayCanvasRef.current.getContext('2d'));
    }
  }, [webcam, socket, resetDetections, setIsStreaming]);

  // Main detection loop — backpressure + 10 FPS cap
  useEffect(() => {
    if (!isStreaming || !webcam.isActive || !isConnected) return;

    const MIN_FRAME_INTERVAL = 100; // 10 FPS cap
    let lastSendTime = 0;

    const loop = () => {
      if (!isStreaming) return;

      const now = performance.now();

      if (!waitingRef.current && now - lastSendTime >= MIN_FRAME_INTERVAL) {
        const frame = webcam.captureFrame();
        if (frame) {
          waitingRef.current = true;
          lastSendTime = now;
          sendTimeRef.current = now; // ← Record send time for RTT
          socket.sendFrame(frame);
          incrementFrameCount();
        }
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isStreaming, webcam.isActive, isConnected]);

  // When detections arrive → unblock + measure RTT + calculate FPS
  useEffect(() => {
    if (!isStreaming) return;

    // Unblock next frame
    waitingRef.current = false;

    // Measure round-trip time (not just server inference)
    if (sendTimeRef.current > 0) {
      const rtt = Math.round(performance.now() - sendTimeRef.current);
      setLatency(rtt);
    }

    // Sliding window FPS: count responses in last 1 second
    const now = performance.now();
    fpsWindowRef.current.push(now);
    // Remove entries older than 1 second
    fpsWindowRef.current = fpsWindowRef.current.filter(t => now - t < 1000);
    setFPS(fpsWindowRef.current.length);

  }, [detections]);

  // Draw detections on overlay canvas
  useEffect(() => {
    if (!overlayCanvasRef.current || !webcam.videoRef.current) return;

    const canvas = overlayCanvasRef.current;
    const video = webcam.videoRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    drawDetections(ctx, detections, canvas.width, canvas.height, 640, 640);
  }, [detections]);

  return {
    videoRef: webcam.videoRef,
    captureCanvasRef: webcam.canvasRef,
    overlayCanvasRef,
    cameraError: webcam.error,
    isCameraActive: webcam.isActive,
    switchCamera: webcam.switchCamera,
    captureBlob: webcam.captureBlob,
    startLiveDetection,
    stopLiveDetection,
    isStreaming,
    connectionStatus,
    detections,
  };
}
