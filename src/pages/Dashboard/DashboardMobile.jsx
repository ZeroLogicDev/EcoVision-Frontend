import WelcomeHeader from './components/WelcomeHeader';
import StatsGrid from './components/StatsGrid';
import QuickActions from './components/QuickActions';
import RecentScans from './components/RecentScans';

export default function DashboardMobile() {
  return (
    <div className="p-4 space-y-5 animate-fade-in">
      <WelcomeHeader />
      <StatsGrid />
      <QuickActions />
      <RecentScans />
    </div>
  );
}
