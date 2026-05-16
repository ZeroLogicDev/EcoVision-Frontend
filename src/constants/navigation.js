import { LayoutDashboard, ScanLine, History, UserCircle } from 'lucide-react';
import { ROUTES } from './routes';

/**
 * Navigation items — shared by Sidebar (desktop) and BottomNav (mobile).
 */
export const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { path: ROUTES.SCANNER, label: 'Scanner', icon: ScanLine, isPrimary: true },
  { path: ROUTES.HISTORY, label: 'Riwayat', icon: History },
  { path: ROUTES.PROFILE, label: 'Profil', icon: UserCircle },
];
