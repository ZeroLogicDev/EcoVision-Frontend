import { useEffect, useRef } from 'react';
import { drawDetections, clearCanvas } from '@/utils/canvasHelper';

/**
 * BoundingBoxOverlay — draws detection boxes on a canvas.
 * Accepts canvas ref and detections array, handles coordinate mapping.
 */
export default function BoundingBoxOverlay({ canvasRef, videoRef, detections, modelWidth = 640, modelHeight = 640 }) {
  const prevDetectionsRef = useRef([]);

  useEffect(() => {
    if (!canvasRef?.current || !videoRef?.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    // Sync canvas size with video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    if (!detections || detections.length === 0) {
      clearCanvas(ctx);
      prevDetectionsRef.current = [];
      return;
    }

    drawDetections(ctx, detections, canvas.width, canvas.height, modelWidth, modelHeight);
    prevDetectionsRef.current = detections;
  }, [detections, canvasRef, videoRef, modelWidth, modelHeight]);

  return null; // Renders directly to canvas ref
}
