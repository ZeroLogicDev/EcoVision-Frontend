import { forwardRef } from 'react';

/**
 * LiveScanner — video + canvas overlay container.
 * Renders webcam feed with bounding box overlay canvas on top.
 */
const LiveScanner = forwardRef(({ videoRef, overlayCanvasRef, captureCanvasRef, isActive, children }, ref) => {
  return (
    <div ref={ref} className="relative w-full aspect-[4/3] bg-black rounded-xl overflow-hidden">
      {/* Video feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* Detection overlay canvas */}
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Hidden capture canvas (for frame extraction) */}
      <canvas ref={captureCanvasRef} className="hidden" />

      {/* HUD / Controls overlay */}
      {children}
    </div>
  );
});

LiveScanner.displayName = 'LiveScanner';
export default LiveScanner;
