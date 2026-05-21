import { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import scanService from '@/services/scanService';

export default function UploadView({ onResult }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Hanya file gambar yang diterima');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maks 10MB');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setAnalyzing(true);

    try {
      const result = await scanService.predictUpload(file);
      onResult?.(result);
      toast.success(`${result.detections?.length || 0} sampah terdeteksi!`);
    } catch (err) {
      toast.error('Gagal menganalisis: ' + (err.message || 'Coba lagi'));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="glass-card overflow-hidden">
      <div
        className="relative aspect-[4/3] flex items-center justify-center cursor-pointer group"
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-contain bg-black" />
            {analyzing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-neon-500 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-white/70">Menganalisis gambar...</p>
                  <p className="text-xs text-white/30 mt-1">Model yolo26m sedang bekerja</p>
                  <p className="text-[10px] text-neon-500/70 mt-1">(Bisa memakan waktu hingga 3 menit saat server baru bangun)</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-neon-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-neon-500/20 transition-colors">
              <Upload className="w-8 h-8 text-neon-500" />
            </div>
            <p className="text-sm text-white/60 mb-1">Klik atau seret gambar ke sini</p>
            <p className="text-xs text-white/30">JPG, PNG, WebP • Maks 10MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {preview && !analyzing && (
        <div className="p-4 border-t border-white/5 flex justify-between">
          <button
            onClick={() => { setPreview(null); onResult?.(null); }}
            className="text-xs text-white/40 hover:text-white/60"
          >
            Ganti Gambar
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-neon px-4 py-2 text-xs"
          >
            Upload Lagi
          </button>
        </div>
      )}
    </div>
  );
}
