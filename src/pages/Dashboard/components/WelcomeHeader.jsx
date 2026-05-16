import { useAuth } from '@/contexts/AuthContext';
import { Sparkles } from 'lucide-react';

export default function WelcomeHeader() {
  const { user, profile } = useAuth();
  const name = profile?.full_name || user?.user_metadata?.full_name || 'Eco Warrior';
  const firstName = name.split(' ')[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat Pagi' : hour < 17 ? 'Selamat Siang' : 'Selamat Malam';

  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h2 className="text-2xl font-bold text-white">
          {greeting}, <span className="text-neon-500">{firstName}</span>
        </h2>
        <p className="text-sm text-white/40 mt-1">Siap untuk mendeteksi sampah hari ini?</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-neon-500/10 flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-neon-500" />
      </div>
    </div>
  );
}
