import { cn } from '@/utils/cn';
import { useDetectionStore } from '@/store/detectionStore';
import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  connected: { icon: Wifi, label: 'Terhubung', color: 'text-neon-500', dot: 'bg-neon-500' },
  connecting: { icon: Loader2, label: 'Menghubungkan...', color: 'text-yellow-400', dot: 'bg-yellow-400', spin: true },
  disconnected: { icon: WifiOff, label: 'Terputus', color: 'text-white/30', dot: 'bg-white/30' },
  error: { icon: AlertCircle, label: 'Error', color: 'text-red-400', dot: 'bg-red-400' },
};

export default function ConnectionStatus({ className }) {
  const connectionStatus = useDetectionStore((s) => s.connectionStatus);
  const config = STATUS_CONFIG[connectionStatus] || STATUS_CONFIG.disconnected;
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-2 text-xs font-mono', config.color, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      <Icon className={cn('w-3.5 h-3.5', config.spin && 'animate-spin')} />
      <span>{config.label}</span>
    </div>
  );
}
