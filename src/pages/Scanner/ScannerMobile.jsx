import { useState } from 'react';
import LiveStreamView from './components/LiveStreamView';
import UploadView from './components/UploadView';
import ResultCard from './components/ResultCard';
import { useDetectionStore } from '@/store/detectionStore';

export default function ScannerMobile() {
  const [uploadResult, setUploadResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const scanMode = useDetectionStore((s) => s.scanMode);
  const setScanMode = useDetectionStore((s) => s.setScanMode);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] animate-fade-in">
      {/* Mode Tabs */}
      <div className="flex items-center gap-2 p-4 pb-2">
        <button
          onClick={() => { setScanMode('live'); setShowResult(false); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            scanMode === 'live' ? 'bg-neon-500/10 text-neon-500' : 'text-white/40'
          }`}
        >
          🔴 Live
        </button>
        <button
          onClick={() => { setScanMode('upload'); setShowResult(false); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            scanMode === 'upload' ? 'bg-neon-500/10 text-neon-500' : 'text-white/40'
          }`}
        >
          📤 Upload
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden px-4 pb-4">
        {showResult ? (
          <div>
            <button onClick={() => setShowResult(false)} className="text-xs text-neon-500 mb-3">← Kembali</button>
            <ResultCard uploadResult={uploadResult} />
          </div>
        ) : scanMode === 'live' ? (
          <LiveStreamView />
        ) : (
          <UploadView onResult={(r) => { setUploadResult(r); setShowResult(true); }} />
        )}
      </div>
    </div>
  );
}
