import WelcomeHeader from './components/WelcomeHeader';
import StatsGrid from './components/StatsGrid';
import RecentScans from './components/RecentScans';
import QuickActions from './components/QuickActions';

export default function DashboardDesktop() {
  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <WelcomeHeader />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <StatsGrid />
          <RecentScans />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
