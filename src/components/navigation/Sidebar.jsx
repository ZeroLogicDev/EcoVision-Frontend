import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { NAV_ITEMS } from '@/constants/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';
import ConnectionStatus from '@/components/ui/ConnectionStatus';

export default function Sidebar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Berhasil keluar');
    } catch {
      toast.error('Gagal keluar');
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 shrink-0 flex flex-col bg-surface-50 border-r border-white/5 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-neon-500/10 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-neon-500" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">EcoVision</h1>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">AI Detection</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest px-3 mb-2 block">Menu</span>
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-neon-500/10 text-neon-500 shadow-sm'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              )
            }
          >
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center')}>
              <Icon className="w-[18px] h-[18px]" />
            </div>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Connection Status */}
      <div className="px-6 py-2">
        <ConnectionStatus />
      </div>

      {/* Profile */}
      <div className="px-4 pb-4">
        <div className="bg-surface-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-500 to-neon-700 flex items-center justify-center text-surface text-sm font-bold shrink-0">
            {displayName[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-[11px] text-white/30 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
