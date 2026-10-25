import { useMemo, useState } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import MarketTable from './components/MarketTable';
import CoinDetail from './components/CoinDetail';
import Compare from './components/Compare';
import { useMarkets } from './hooks/useMarkets';
import { useTheme } from './hooks/useTheme';
import './App.css';

export default function App() {
  const { coins, status, lastUpdated } = useMarkets();
  const { theme, toggle: toggleTheme } = useTheme();
  const [view, setView] = useState('market'); // 'market' | 'compare'
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('market_cap');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = coins;
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const av = a[sortKey] ?? -Infinity;
      const bv = b[sortKey] ?? -Infinity;
      return bv - av;
    });
  }, [coins, query, sortKey]);

  return (
    <div className={`app ${selected ? 'app-split' : ''}`}>
      <div className="app-main">
        <Header
          coins={coins}
          lastUpdated={lastUpdated}
          status={status}
          theme={theme}
          onToggleTheme={toggleTheme}
          view={view}
          onChangeView={setView}
        />

        <main className="content">
          {view === 'market' ? (
            <>
              <Controls
                query={query}
                onQuery={setQuery}
                sortKey={sortKey}
                onSort={setSortKey}
              />

              {status === 'error' && (
                <p className="error-banner mono">
                  Gagal mengambil data dari CoinGecko. Coba muat ulang halaman.
                </p>
              )}

              {status === 'loading' && coins.length === 0 ? (
                <p className="empty-state mono">memuat data pasar...</p>
              ) : (
                <MarketTable coins={filtered} onSelect={setSelected} />
              )}
            </>
          ) : (
            <Compare coins={coins} />
          )}
        </main>

        <footer className="footer mono">
          Sumber data: CoinGecko API &middot; diperbarui tiap 60 detik &middot;hanya dashboard 
        </footer>
      </div>

      {selected && (
        <CoinDetail coin={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}