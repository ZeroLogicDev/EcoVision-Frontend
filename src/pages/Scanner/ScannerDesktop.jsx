import { useState } from 'react';
import LiveStreamView from './components/LiveStreamView';
import UploadView from './components/UploadView';
import ResultCard from './components/ResultCard';
import { useDetectionStore } from '@/store/detectionStore';

export default function ScannerDesktop() {
  const [uploadResult, setUploadResult] = useState(null);
  const scanMode = useDetectionStore((s) => s.scanMode);
  const setScanMode = useDetectionStore((s) => s.setScanMode);

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto animate-fade-in">
      {/* Mode Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setScanMode('live')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            scanMode === 'live' ? 'bg-neon-500/10 text-neon-500 border border-neon-500/20' : 'text-white/40 hover:text-white/60'
          }`}
        >
          🔴 Live Detection
        </button>
        <button
          onClick={() => setScanMode('upload')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            scanMode === 'upload' ? 'bg-neon-500/10 text-neon-500 border border-neon-500/20' : 'text-white/40 hover:text-white/60'
          }`}
        >
          📤 Upload Foto
        </button>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Camera/Upload Area */}
        <div className="col-span-3">
          {scanMode === 'live' ? <LiveStreamView /> : <UploadView onResult={setUploadResult} />}
        </div>

        {/* Result Panel */}
        <div className="col-span-2">
          <ResultCard uploadResult={uploadResult} />
        </div>
      </div>
    </div>
  );
}
