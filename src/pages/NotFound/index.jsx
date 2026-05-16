import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SearchX } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import Button from '@/components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet><title>404 — EcoVision</title></Helmet>
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 text-center">
        <p className="text-8xl font-extrabold text-neon-500/20 mb-4">404</p>
        <div className="w-14 h-14 rounded-2xl bg-surface-200 flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7 text-white/20" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-white/40 mb-8">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
        <Button onClick={() => navigate(ROUTES.DASHBOARD)}>Kembali ke Dashboard</Button>
      </div>
    </>
  );
}
