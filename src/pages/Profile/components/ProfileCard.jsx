import { Calendar, ScanLine, Mail } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { formatDate } from '@/utils/formatDate';

/**
 * ProfileCard — displays user info with avatar and stats.
 */
export default function ProfileCard({ user, profile }) {
  const name = profile?.full_name || user?.user_metadata?.full_name || 'User';

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-4 mb-6">
        <Avatar
          src={profile?.avatar_url || user?.user_metadata?.avatar_url}
          name={name}
          size="lg"
        />
        <div>
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <p className="text-sm text-white/40 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> {user?.email}
          </p>
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
  );
}
