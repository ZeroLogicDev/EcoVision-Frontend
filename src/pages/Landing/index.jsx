import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ScanLine, Zap, Shield, ArrowRight, Leaf, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';
import Button from '@/components/ui/Button';

const FEATURES = [
  { icon: Eye, title: 'Deteksi Real-Time', desc: 'Arahkan kamera, AI langsung mendeteksi sampah di sekitarmu dalam hitungan milidetik.' },
  { icon: Zap, title: 'YOLO AI Engine', desc: 'Didukung model YOLO yang dilatih khusus untuk mengenali sampah dengan akurasi tinggi.' },
  { icon: Shield, title: 'Upload & Analisis', desc: 'Unggah foto untuk analisis mendalam menggunakan model AI yang lebih akurat.' },
];

export default function Landing() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(session ? ROUTES.DASHBOARD : ROUTES.LOGIN);
  };

  return (
    <>
      <Helmet>
        <title>EcoVision — Deteksi Sampah AI Real-Time</title>
      </Helmet>

      <div className="min-h-screen bg-surface overflow-hidden">
        {/* Nav */}
        <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Leaf className="w-6 h-6 text-neon-500" />
              <span className="text-lg font-bold text-white">EcoVision</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleStart}>
              {session ? 'Dashboard' : 'Masuk'} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Hero */}
        <section className="relative pt-32 pb-20 px-6">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-500/10 border border-neon-500/20 text-neon-500 text-xs font-mono mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-500 animate-pulse" />
                AI-Powered Detection
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Deteksi Sampah
                <span className="block text-neon-500">Secara Real-Time</span>
              </h1>

              <p className="text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
                EcoVision menggunakan teknologi YOLO AI untuk mendeteksi sampah di sekitarmu
                secara instan melalui kamera atau unggahan foto.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleStart} className="text-base">
                  <ScanLine className="w-5 h-5" /> Mulai Deteksi
                </Button>
                <Button variant="ghost" onClick={() => document.getElementById('fitur')?.scrollIntoView({ behavior: 'smooth' })}>
                  Pelajari Lebih Lanjut
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="fitur" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
              Mengapa <span className="text-neon-500">EcoVision</span>?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="glass-card-hover p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-neon-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-neon-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white/30">
              <Leaf className="w-4 h-4" />
              <span className="text-sm">EcoVision © 2026</span>
            </div>
            <p className="text-xs text-white/20 font-mono">Built with YOLO + React + FastAPI</p>
          </div>
        </footer>
      </div>
    </>
  );
}
