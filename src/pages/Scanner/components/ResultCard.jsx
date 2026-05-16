import { useDetectionStore } from '@/store/detectionStore';
import { formatConfidence, getConfidenceColor } from '@/utils/formatConfidence';
import { Eye, Trash2 } from 'lucide-react';

export default function ResultCard({ uploadResult }) {
  const liveDetections = useDetectionStore((s) => s.detections);
  const scanMode = useDetectionStore((s) => s.scanMode);

  const detections = scanMode === 'upload' && uploadResult?.detections
    ? uploadResult.detections
    : liveDetections;

  if (!detections || detections.length === 0) {
    return (
      <div className="glass-card p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-surface-200 flex items-center justify-center mb-4">
          <Eye className="w-7 h-7 text-white/15" />
        </div>
        <p className="text-sm text-white/40 mb-1">Belum ada deteksi</p>
        <p className="text-xs text-white/20">
          {scanMode === 'live' ? 'Mulai live detection untuk melihat hasil' : 'Upload gambar untuk menganalisis'}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Hasil Deteksi</h3>
        <span className="text-xs font-mono text-neon-500 bg-neon-500/10 px-2 py-0.5 rounded">
          {detections.length} objek
        </span>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {detections.map((det, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-200/50">
            <div className="w-9 h-9 rounded-lg bg-neon-500/10 flex items-center justify-center shrink-0">
              <Trash2 className="w-4 h-4 text-neon-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">Sampah #{i + 1}</p>
              <p className="text-xs text-white/30">
                {det.class_name || 'trash'} • {Math.round((det.x2 - det.x1) * (det.y2 - det.y1))}px²
              </p>
            </div>
            <span className={`text-sm font-mono font-bold ${getConfidenceColor(det.confidence)}`}>
              {formatConfidence(det.confidence)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
