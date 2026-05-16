import { Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { formatConfidence, getConfidenceColor } from '@/utils/formatConfidence';

/**
 * HistoryTable — desktop table view of scan history.
 */
export default function HistoryTable({ scans = [] }) {
  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left text-xs font-mono text-white/30 uppercase p-4">Tanggal</th>
            <th className="text-left text-xs font-mono text-white/30 uppercase p-4">Mode</th>
            <th className="text-left text-xs font-mono text-white/30 uppercase p-4">Deteksi</th>
            <th className="text-left text-xs font-mono text-white/30 uppercase p-4">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => (
            <tr key={scan.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="p-4 text-sm text-white/70">{formatDate(scan.created_at)}</td>
              <td className="p-4">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                  scan.scan_mode === 'live' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {scan.scan_mode}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-3.5 h-3.5 text-neon-500" />
                  <span className="text-sm text-white">{scan.detection_count || 0}</span>
                </div>
              </td>
              <td className="p-4">
                <span className={`text-sm font-mono ${getConfidenceColor(scan.confidence_avg)}`}>
                  {formatConfidence(scan.confidence_avg)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
