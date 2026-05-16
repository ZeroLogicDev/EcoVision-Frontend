import { createContext, useContext, useEffect, useState } from 'react';
import authService from '@/services/authService';
import profileService from '@/services/profileService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Safety timeout — never stay loading for more than 8 seconds
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('[AuthContext] Init timeout — forcing loading=false');
        setLoading(false);
      }
    }, 8000);

    async function initAuth() {
      try {
        const currentSession = await authService.getSession();
        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        // Fetch profile in background (non-blocking)
        if (currentSession?.user) {
          profileService.getProfile(currentSession.user.id)
            .then((p) => isMounted && setProfile(p))
            .catch((err) => console.warn('[AuthContext] Profile fetch failed:', err));
        }
      } catch (err) {
        console.error('[AuthContext] Init error:', err);
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = authService.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        profileService.getProfile(newSession.user.id)
          .then((p) => isMounted && setProfile(p))
          .catch(() => {});
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    profile,
    loading,
    setProfile,
    signInWithGoogle: authService.signInWithGoogle,
    signOut: authService.signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
