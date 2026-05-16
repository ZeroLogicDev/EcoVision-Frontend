import { useState } from 'react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import profileService from '@/services/profileService';
import Button from '@/components/ui/Button';

/**
 * EditProfileForm — edit display name.
 */
export default function EditProfileForm() {
  const { user, profile, setProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Nama tidak boleh kosong');
      return;
    }

    setSaving(true);
    try {
      const updated = await profileService.updateProfile(user.id, { full_name: fullName.trim() });
      setProfile(updated);
      toast.success('Profil berhasil diperbarui');
    } catch (err) {
      toast.error('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="glass-card p-6 space-y-4">
      <h3 className="text-sm font-semibold text-white">Edit Profil</h3>

      <div>
        <label className="text-xs text-white/30 block mb-1.5">Nama Lengkap</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border border-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-neon-500/30 transition-colors"
          placeholder="Masukkan nama lengkap"
        />
      </div>

      <div>
        <label className="text-xs text-white/30 block mb-1.5">Email</label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="w-full px-4 py-2.5 rounded-xl bg-surface-300/50 border border-white/5 text-sm text-white/30 cursor-not-allowed"
        />
      </div>

      <Button type="submit" loading={saving} className="w-full justify-center">
        <Save className="w-4 h-4" /> Simpan Perubahan
      </Button>
    </form>
  );
}
