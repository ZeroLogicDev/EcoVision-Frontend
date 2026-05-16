import { useEffect, useRef, useCallback, useState } from 'react';
import { useWebcam } from './useWebcam';
import { useSocket } from './useSocket';
import { useDetectionStore } from '@/store/detectionStore';
import { createFrameThrottler } from '@/utils/frameThrottler';
import { drawDetections, clearCanvas } from '@/utils/canvasHelper';

/**
 * Orchestrator hook — combines webcam + WebSocket + canvas drawing.
 */
export function useDetection() {
  const webcam = useWebcam();
  const socket = useSocket();
  const overlayCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const throttlerRef = useRef(createFrameThrottler(5));
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
  }, [webcam, socket, setIsStreaming]);

  const stopLiveDetection = useCallback(() => {
    setIsStreaming(false);
    webcam.stopCamera();
    socket.disconnect();
    resetDetections();

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (overlayCanvasRef.current) {
      clearCanvas(overlayCanvasRef.current.getContext('2d'));
    }
  }, [webcam, socket, resetDetections, setIsStreaming]);

  // Main detection loop
  useEffect(() => {
    if (!isStreaming || !webcam.isActive || !isConnected) return;

    const loop = () => {
      if (!isStreaming) return;

      if (throttlerRef.current.shouldCapture()) {
        const frame = webcam.captureFrame();
        if (frame) {
          socket.sendFrame(frame);
          incrementFrameCount();

          // Calculate FPS
          fpsCountRef.current.count++;
          const now = performance.now();
          if (now - fpsCountRef.current.lastTime >= 1000) {
            setFPS(fpsCountRef.current.count);
            fpsCountRef.current.count = 0;
            fpsCountRef.current.lastTime = now;
          }
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
