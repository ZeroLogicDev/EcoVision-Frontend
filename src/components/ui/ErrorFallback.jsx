import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorFallback({ error, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Terjadi Kesalahan</h2>
      <p className="text-sm text-white/40 max-w-md mb-2">
        Aplikasi mengalami error. Silakan coba muat ulang halaman.
      </p>
      {error?.message && (
        <code className="text-xs text-red-400/60 bg-red-500/5 px-3 py-1 rounded-lg mb-6 font-mono">
          {error.message}
        </code>
      )}
      <Button variant="ghost" onClick={onReset}>
        <RefreshCw className="w-4 h-4" /> Muat Ulang
      </Button>
    </div>
  );
}
