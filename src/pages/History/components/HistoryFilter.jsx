import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

/**
 * HistoryFilter — search bar + scan mode filter.
 */
export default function HistoryFilter({ onFilter, onSearch }) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('all'); // 'all' | 'live' | 'upload'

  const handleSearch = (value) => {
    setQuery(value);
    onSearch?.(value);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    onFilter?.({ mode: newMode });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          placeholder="Cari riwayat..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-200 border border-white/5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-neon-500/30 transition-colors"
        />
        {query && (
          <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Mode filter */}
      <div className="flex items-center gap-1 bg-surface-200 rounded-xl p-1">
        {[
          { key: 'all', label: 'Semua' },
          { key: 'live', label: 'Live' },
          { key: 'upload', label: 'Upload' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleModeChange(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === key ? 'bg-neon-500/10 text-neon-500' : 'text-white/30 hover:text-white/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
