import { useDetection } from '@/hooks/useDetection';
import { useDetectionStore } from '@/store/detectionStore';
import ConnectionStatus from '@/components/ui/ConnectionStatus';
import { FlipHorizontal, Play, Square } from 'lucide-react';

export default function LiveStreamView() {
  const {
    videoRef, captureCanvasRef, overlayCanvasRef,
    cameraError, isCameraActive,
    startLiveDetection, stopLiveDetection,
    switchCamera, isStreaming,
  } = useDetection();

  const fps = useDetectionStore((s) => s.fps);
  const detections = useDetectionStore((s) => s.detections);
  const latency = useDetectionStore((s) => s.latency);

  return (
    <div className="glass-card overflow-hidden">
      {/* Camera viewport */}
      <div className="relative aspect-[4/3] bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        <canvas ref={overlayCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        <canvas ref={captureCanvasRef} className="hidden" />

        {/* HUD overlay */}
        {isStreaming && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono text-white/70 bg-black/50 px-2 py-0.5 rounded">
                {fps} FPS
              </span>
              {latency > 0 && (
                <span className="text-xs font-mono text-white/50 bg-black/50 px-2 py-0.5 rounded">
                  {latency}ms
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-neon-500 bg-black/50 px-2 py-0.5 rounded">
              {detections.length} deteksi
            </span>
          </div>
        )}

        {/* Camera error */}
        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-100">
            <div className="text-center p-6">
              <p className="text-sm text-red-400 mb-2">Gagal mengakses kamera</p>
              <p className="text-xs text-white/30">{cameraError}</p>
            </div>
          </div>
        )}

        {/* Idle state */}
        {!isStreaming && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-100">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-neon-500/10 flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-neon-500" />
              </div>
              <p className="text-sm text-white/50">Tekan tombol untuk memulai deteksi</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 flex items-center justify-between border-t border-white/5">
        <ConnectionStatus />

        <div className="flex items-center gap-3">
          <button
            onClick={switchCamera}
            disabled={!isStreaming}
            className="p-2.5 rounded-xl bg-surface-200 text-white/50 hover:text-white disabled:opacity-30 transition-colors"
          >
            <FlipHorizontal className="w-5 h-5" />
          </button>

          {isStreaming ? (
            <button onClick={stopLiveDetection} className="btn-danger px-5 py-2.5 text-sm">
              <Square className="w-4 h-4" /> Berhenti
            </button>
          ) : (
            <button onClick={startLiveDetection} className="btn-neon px-5 py-2.5 text-sm">
              <Play className="w-4 h-4" /> Mulai Deteksi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
