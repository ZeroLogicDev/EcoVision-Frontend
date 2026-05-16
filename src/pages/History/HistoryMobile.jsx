import { useAuth } from '@/contexts/AuthContext';
import { useScanHistory } from '@/hooks/useScanHistory';
import { formatRelativeTime } from '@/utils/formatDate';
import { formatConfidence, getConfidenceColor } from '@/utils/formatConfidence';
import EmptyState from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ScanLine, Trash2, Clock } from 'lucide-react';

export default function HistoryMobile() {
  const { user } = useAuth();
  const { history, loading } = useScanHistory(user?.id);
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h2 className="text-lg font-bold text-white">Riwayat Scan</h2>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20" />)}</div>
      ) : history.length === 0 ? (
        <EmptyState title="Belum ada riwayat" actionLabel="Mulai Scanner" onAction={() => navigate(ROUTES.SCANNER)} icon={ScanLine} />
      ) : (
        <div className="space-y-2">
          {history.map((scan) => (
            <div key={scan.id} className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neon-500/10 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-neon-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{scan.detection_count || 0} sampah terdeteksi</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    scan.scan_mode === 'live' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>{scan.scan_mode}</span>
                  <span className="flex items-center gap-1 text-[10px] text-white/20">
                    <Clock className="w-2.5 h-2.5" /> {formatRelativeTime(scan.created_at)}
                  </span>
                </div>
              </div>
              <span className={`text-xs font-mono font-bold ${getConfidenceColor(scan.confidence_avg)}`}>
                {formatConfidence(scan.confidence_avg)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
