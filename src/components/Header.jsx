import { formatPercent, formatUsd } from '../utils/format';

export default function Header({
  coins,
  lastUpdated,
  status,
  theme,
  onToggleTheme,
  view,
  onChangeView,
}) {
  const movers = [...coins]
    .sort(
      (a, b) =>
        Math.abs(b.price_change_percentage_24h || 0) -
        Math.abs(a.price_change_percentage_24h || 0)
    )
    .slice(0, 16);

  return (
    <header className="header">
      <div className="header-top">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <h1>CRYPTO&nbsp;WATCH</h1>
            <p className="brand-sub">pasar kripto, waktu nyata</p>
          </div>
        </div>

        <nav className="view-tabs mono" aria-label="Navigasi">
          <button
            className={`view-tab ${view === 'market' ? 'view-tab-active' : ''}`}
            onClick={() => onChangeView('market')}
          >
            Pasar
          </button>
          <button
            className={`view-tab ${view === 'compare' ? 'view-tab-active' : ''}`}
            onClick={() => onChangeView('compare')}
          >
            Bandingkan
          </button>
        </nav>

        <div className="header-status mono">
          <span className={`dot ${status === 'ok' ? 'dot-live' : status === 'error' ? 'dot-error' : 'dot-loading'}`} />
          {status === 'ok' && lastUpdated
            ? `diperbarui ${lastUpdated.toLocaleTimeString('id-ID')}`
            : status === 'error'
            ? 'gagal memuat data'
            : 'memuat data...'}
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Ganti ke tema ${theme === 'dark' ? 'terang' : 'gelap'}`}
            title={`Ganti ke tema ${theme === 'dark' ? 'terang' : 'gelap'}`}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>

      {movers.length > 0 && (
        <div className="ticker" role="marquee" aria-label="Pergerakan harga">
          <div className="ticker-track">
            {[...movers, ...movers].map((c, i) => {
              const change = c.price_change_percentage_24h || 0;
              return (
                <span className="ticker-item mono" key={c.id + i}>
                  <span className="ticker-symbol">{c.symbol.toUpperCase()}</span>
                  <span>{formatUsd(c.current_price)}</span>
                  <span className={change >= 0 ? 'up' : 'down'}>
                    {formatPercent(change)}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}