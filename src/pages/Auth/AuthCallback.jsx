import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AuthCallback() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(session ? ROUTES.DASHBOARD : ROUTES.LOGIN, { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [session, navigate]);

  return <LoadingSpinner />;
}
