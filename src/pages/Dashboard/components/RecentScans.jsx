import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import historyService from '@/services/historyService';
import { ROUTES } from '@/constants/routes';
import { formatRelativeTime } from '@/utils/formatDate';
import EmptyState from '@/components/ui/EmptyState';

export default function RecentScans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    historyService.fetchHistory(user.id, { limit: 5 })
      .then(({ data }) => setScans(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Scan Terbaru</h3>
        <button
          onClick={() => navigate(ROUTES.HISTORY)}
          className="text-xs text-neon-500 hover:text-neon-400 transition-colors"
        >
          Lihat Semua
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12" />)}</div>
      ) : scans.length === 0 ? (
        <EmptyState
          title="Belum ada scan"
          description="Mulai scanner untuk mendeteksi sampah"
          actionLabel="Mulai Scanner"
          onAction={() => navigate(ROUTES.SCANNER)}
        />
      ) : (
        <div className="space-y-2">
          {scans.map((scan) => (
            <div key={scan.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-200/50 hover:bg-surface-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-neon-500/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-neon-500">{scan.detection_count || 0}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  {scan.detection_count || 0} sampah terdeteksi
                </p>
                <p className="text-xs text-white/30 capitalize">{scan.scan_mode}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-white/20">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(scan.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
