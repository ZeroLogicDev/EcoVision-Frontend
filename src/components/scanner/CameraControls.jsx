import { FlipHorizontal, Play, Square, ZoomIn, ZoomOut } from 'lucide-react';
import ConnectionStatus from '@/components/ui/ConnectionStatus';

/**
 * CameraControls — switch camera, start/stop, zoom.
 */
export default function CameraControls({ isStreaming, onStart, onStop, onSwitchCamera, disabled }) {
  return (
    <div className="flex items-center justify-between p-4 border-t border-white/5">
      <ConnectionStatus />

      <div className="flex items-center gap-2">
        <button
          onClick={onSwitchCamera}
          disabled={!isStreaming || disabled}
          className="p-2.5 rounded-xl bg-surface-200 text-white/50 hover:text-white disabled:opacity-30 transition-colors"
          title="Ganti Kamera"
        >
          <FlipHorizontal className="w-5 h-5" />
        </button>

        {isStreaming ? (
          <button
            onClick={onStop}
            disabled={disabled}
            className="btn-danger px-5 py-2.5 text-sm"
          >
            <Square className="w-4 h-4" /> Berhenti
          </button>
        ) : (
          <button
            onClick={onStart}
            disabled={disabled}
            className="btn-neon px-5 py-2.5 text-sm"
          >
            <Play className="w-4 h-4" /> Mulai Deteksi
          </button>
        )}
      </div>
    </div>
  );
}
