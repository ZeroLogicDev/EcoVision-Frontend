import { useEffect, useRef, useCallback, useState } from 'react';
import { useWebcam } from './useWebcam';
import { useDetectionStore } from '@/store/detectionStore';
import { loadModel, detectFrame, getModelStatus } from '@/utils/onnxDetector';
import { drawDetections, clearCanvas } from '@/utils/canvasHelper';

/**
 * Orchestrator hook — combines webcam + ONNX local inference + canvas drawing.
 * No WebSocket needed — inference runs entirely in the browser.
 */
export function useDetection() {
  const webcam = useWebcam();
  const overlayCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const fpsWindowRef = useRef([]);
  const [modelStatus, setModelStatus] = useState('idle'); // idle | loading | ready | error
  const [modelError, setModelError] = useState(null);

  const {
    connectionStatus,
    detections,
    isStreaming,
    setIsStreaming,
    setFPS,
    setLatency,
    setDetections,
    setConnectionStatus,
    incrementFrameCount,
    resetDetections,
  } = useDetectionStore();

  // Load ONNX model
  const loadOnnxModel = useCallback(async () => {
    try {
      setModelStatus('loading');
      setConnectionStatus('connecting');
      await loadModel((msg) => console.log('[ONNX]', msg));
      setModelStatus('ready');
      setConnectionStatus('connected');
    } catch (err) {
      setModelStatus('error');
      setModelError(err.message);
      setConnectionStatus('error');
    }
  }, [setConnectionStatus]);

  const startLiveDetection = useCallback(async () => {
    await webcam.startCamera();
    await loadOnnxModel();
    setIsStreaming(true);
    fpsWindowRef.current = [];
  }, [webcam, loadOnnxModel, setIsStreaming]);

  const stopLiveDetection = useCallback(() => {
    setIsStreaming(false);
    webcam.stopCamera();
    resetDetections();

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (overlayCanvasRef.current) {
      clearCanvas(overlayCanvasRef.current.getContext('2d'));
    }
  }, [webcam, resetDetections, setIsStreaming]);

  // Main detection loop — local ONNX inference
  useEffect(() => {
    if (!isStreaming || !webcam.isActive || modelStatus !== 'ready') return;

    let running = true;

    const loop = async () => {
      if (!running) return;

      const video = webcam.videoRef.current;
      const canvas = webcam.canvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        try {
          const start = performance.now();
          const results = await detectFrame(video, canvas);
          const latency = Math.round(performance.now() - start);

          setDetections(results);
          setLatency(latency);
          incrementFrameCount();

          // Sliding window FPS
          const now = performance.now();
          fpsWindowRef.current.push(now);
          fpsWindowRef.current = fpsWindowRef.current.filter(t => now - t < 1000);
          setFPS(fpsWindowRef.current.length);
        } catch (err) {
          console.warn('[ONNX] Inference error:', err);
        }
      }

      if (running) {
        animationRef.current = requestAnimationFrame(loop);
      }
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isStreaming, webcam.isActive, modelStatus]);

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
    modelStatus,
    modelError,
  };
}
