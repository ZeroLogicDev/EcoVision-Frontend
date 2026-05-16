import { useAuth } from '@/contexts/AuthContext';
import { Calendar, ScanLine } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';

export default function ProfileMobile() {
  const { user, profile } = useAuth();
  const name = profile?.full_name || user?.user_metadata?.full_name || 'User';

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="glass-card p-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-500 to-neon-700 flex items-center justify-center text-surface text-2xl font-bold mx-auto mb-3">
          {name[0]?.toUpperCase()}
        </div>
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <p className="text-sm text-white/40">{user?.email}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 flex items-center gap-3">
          <Calendar className="w-4 h-4 text-white/30" />
          <div>
            <p className="text-[10px] text-white/30">Bergabung</p>
            <p className="text-sm text-white">{formatDate(profile?.created_at, 'd MMM yyyy')}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <ScanLine className="w-4 h-4 text-neon-500" />
          <div>
            <p className="text-[10px] text-white/30">Total Scan</p>
            <p className="text-sm text-white">{profile?.total_scans || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
