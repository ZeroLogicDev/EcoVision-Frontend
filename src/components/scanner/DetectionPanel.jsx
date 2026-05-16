import { Trash2, Eye } from 'lucide-react';
import { formatConfidence, getConfidenceColor } from '@/utils/formatConfidence';
import ConfidenceMeter from '@/components/ui/ConfidenceMeter';

/**
 * DetectionPanel — shows real-time detection results as a list.
 */
export default function DetectionPanel({ detections = [], className }) {
  if (!detections || detections.length === 0) {
    return (
      <div className={`glass-card p-5 flex flex-col items-center justify-center text-center ${className || ''}`}>
        <Eye className="w-8 h-8 text-white/10 mb-3" />
        <p className="text-sm text-white/30">Menunggu deteksi...</p>
      </div>
    );
  }

  return (
    <div className={`glass-card p-4 space-y-3 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-white/30 uppercase tracking-wider">Deteksi Real-Time</span>
        <span className="text-xs font-mono text-neon-500">{detections.length} objek</span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {detections.map((det, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-200/50">
            <div className="w-8 h-8 rounded-lg bg-neon-500/10 flex items-center justify-center shrink-0">
              <Trash2 className="w-4 h-4 text-neon-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white">Sampah #{i + 1}</p>
              <ConfidenceMeter value={det.confidence} size="sm" />
            </div>
            <span className={`text-xs font-mono font-bold ${getConfidenceColor(det.confidence)}`}>
              {formatConfidence(det.confidence)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
