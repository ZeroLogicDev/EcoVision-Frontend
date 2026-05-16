import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/constants/navigation';
import { cn } from '@/utils/cn';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-50/90 backdrop-blur-xl border-t border-white/5 z-40 safe-bottom">
      <div className="flex items-center justify-around h-full px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon, isPrimary }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200',
                isPrimary && !isActive && 'relative',
                isActive
                  ? 'text-neon-500'
                  : 'text-white/30 hover:text-white/50'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isPrimary ? (
                  <div className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center -mt-5 shadow-lg transition-all',
                    isActive
                      ? 'bg-neon-500 text-surface shadow-neon'
                      : 'bg-surface-300 text-white/60'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                ) : (
                  <Icon className="w-5 h-5" />
                )}
                <span className="text-[10px] font-medium">{label}</span>
                {isActive && !isPrimary && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-neon-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
