import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '@/hooks/useIsMobile';
import ProfileDesktop from './ProfileDesktop';
import ProfileMobile from './ProfileMobile';

export default function Profile() {
  const isMobile = useIsMobile();
  return (
    <>
      <Helmet><title>Profil — EcoVision</title></Helmet>
      {isMobile ? <ProfileMobile /> : <ProfileDesktop />}
    </>
  );
}
