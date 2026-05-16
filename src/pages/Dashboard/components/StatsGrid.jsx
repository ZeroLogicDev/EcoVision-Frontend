import { useEffect, useState } from 'react';
import { ScanLine, Eye, Upload, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import historyService from '@/services/historyService';

const STAT_ITEMS = [
  { key: 'totalScans', label: 'Total Scan', icon: ScanLine, color: 'text-neon-500', bg: 'bg-neon-500/10' },
  { key: 'totalDetections', label: 'Deteksi', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { key: 'liveScans', label: 'Live Scan', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { key: 'uploadScans', label: 'Upload', icon: Upload, color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

export default function StatsGrid() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalScans: 0, totalDetections: 0, liveScans: 0, uploadScans: 0 });

  useEffect(() => {
    if (!user) return;
    historyService.getStats(user.id).then(setStats).catch(() => {});
  }, [user]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {STAT_ITEMS.map(({ key, label, icon: Icon, color, bg }) => (
        <div key={key} className="glass-card p-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats[key]}</p>
            <p className="text-xs text-white/40">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
