import { useAuth } from '@/contexts/AuthContext';
import { Mail, Calendar, ScanLine } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';

export default function ProfileDesktop() {
  const { user, profile } = useAuth();
  const name = profile?.full_name || user?.user_metadata?.full_name || 'User';

  return (
    <div className="p-8 lg:p-10 max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-6">Profil</h2>
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-500 to-neon-700 flex items-center justify-center text-surface text-2xl font-bold">
            {name[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <p className="text-sm text-white/40">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface-200/50 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-white/30" />
            <div>
              <p className="text-xs text-white/30">Bergabung</p>
              <p className="text-sm text-white">{formatDate(profile?.created_at, 'd MMM yyyy')}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-200/50 flex items-center gap-3">
            <ScanLine className="w-4 h-4 text-neon-500" />
            <div>
              <p className="text-xs text-white/30">Total Scan</p>
              <p className="text-sm text-white">{profile?.total_scans || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
