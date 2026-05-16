import { useAuth } from '@/contexts/AuthContext';
import { useScanHistory } from '@/hooks/useScanHistory';
import { formatDate } from '@/utils/formatDate';
import { formatConfidence, getConfidenceColor } from '@/utils/formatConfidence';
import EmptyState from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ScanLine, Trash2 } from 'lucide-react';

export default function HistoryDesktop() {
  const { user } = useAuth();
  const { history, loading } = useScanHistory(user?.id);
  const navigate = useNavigate();

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Riwayat Scan</h2>
          <p className="text-sm text-white/40 mt-1">Semua hasil deteksi kamu</p>
        </div>
        <span className="text-xs font-mono text-white/30">{history.length} scan</span>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16" />)}</div>
      ) : history.length === 0 ? (
        <EmptyState
          title="Belum ada riwayat"
          description="Mulai scanner untuk mendeteksi sampah"
          actionLabel="Mulai Scanner"
          onAction={() => navigate(ROUTES.SCANNER)}
          icon={ScanLine}
        />
      ) : (
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
              {history.map((scan) => (
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
      )}
    </div>
  );
}
