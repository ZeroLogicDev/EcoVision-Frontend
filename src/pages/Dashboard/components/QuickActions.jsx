import { useNavigate } from 'react-router-dom';
import { ScanLine, History, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-mono text-white/30 uppercase tracking-widest">Aksi Cepat</h3>

      <button
        onClick={() => navigate(ROUTES.SCANNER)}
        className="w-full glass-card-hover p-5 flex items-center gap-4 group text-left"
      >
        <div className="w-12 h-12 rounded-xl bg-neon-500/10 flex items-center justify-center group-hover:bg-neon-500/20 transition-colors">
          <ScanLine className="w-6 h-6 text-neon-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Mulai Scanner</p>
          <p className="text-xs text-white/40">Deteksi sampah secara real-time</p>
        </div>
        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-neon-500 transition-colors" />
      </button>

      <button
        onClick={() => navigate(ROUTES.HISTORY)}
        className="w-full glass-card-hover p-5 flex items-center gap-4 group text-left"
      >
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
          <History className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Riwayat Scan</p>
          <p className="text-xs text-white/40">Lihat hasil deteksi sebelumnya</p>
        </div>
        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors" />
      </button>
    </div>
  );
}
