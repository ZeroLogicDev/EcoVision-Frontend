import { useEffect, useRef, useCallback, useState } from 'react';
import { useWebcam } from './useWebcam';
import { useSocket } from './useSocket';
import { useDetectionStore } from '@/store/detectionStore';
import { drawDetections, clearCanvas } from '@/utils/canvasHelper';

/**
 * Orchestrator hook — combines webcam + WebSocket + canvas drawing.
 * Implements backpressure: only sends next frame after receiving response.
 */
export function useDetection() {
  const webcam = useWebcam();
  const socket = useSocket();
  const overlayCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const waitingRef = useRef(false); // ← Backpressure flag
  const fpsCountRef = useRef({ count: 0, lastTime: performance.now() });

  const {
    isConnected,
    connectionStatus,
    detections,
    isStreaming,
    setIsStreaming,
    setFPS,
    incrementFrameCount,
    resetDetections,
  } = useDetectionStore();

  const startLiveDetection = useCallback(async () => {
    await webcam.startCamera();
    socket.connect();
    setIsStreaming(true);
    waitingRef.current = false;
  }, [webcam, socket, setIsStreaming]);

  const stopLiveDetection = useCallback(() => {
    setIsStreaming(false);
    webcam.stopCamera();
    socket.disconnect();
    resetDetections();
    waitingRef.current = false;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (overlayCanvasRef.current) {
      clearCanvas(overlayCanvasRef.current.getContext('2d'));
    }
  }, [webcam, socket, resetDetections, setIsStreaming]);

  // Main detection loop — with backpressure
  useEffect(() => {
    if (!isStreaming || !webcam.isActive || !isConnected) return;

    const MIN_FRAME_INTERVAL = 100; // 10 FPS cap (100ms minimum between frames)
    let lastSendTime = 0;

    const loop = () => {
      if (!isStreaming) return;

      const now = performance.now();

      // Only send if NOT waiting AND enough time has passed (10 FPS cap)
      if (!waitingRef.current && now - lastSendTime >= MIN_FRAME_INTERVAL) {
        const frame = webcam.captureFrame();
        if (frame) {
          waitingRef.current = true; // ← Block until response
          lastSendTime = now;
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

  // When detections arrive → unblock next frame + calculate FPS
  useEffect(() => {
    if (!isStreaming) return;

    // Response received — allow next frame
    waitingRef.current = false;

    // Calculate FPS
    fpsCountRef.current.count++;
    const now = performance.now();
    if (now - fpsCountRef.current.lastTime >= 1000) {
      setFPS(fpsCountRef.current.count);
      fpsCountRef.current.count = 0;
      fpsCountRef.current.lastTime = now;
    }
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
    // Webcam
    videoRef: webcam.videoRef,
    captureCanvasRef: webcam.canvasRef,
    overlayCanvasRef,
    cameraError: webcam.error,
    isCameraActive: webcam.isActive,
    switchCamera: webcam.switchCamera,
    captureBlob: webcam.captureBlob,

    // Detection
    startLiveDetection,
    stopLiveDetection,
    isStreaming,
    connectionStatus,
    detections,
  };
}
