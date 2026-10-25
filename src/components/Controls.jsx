export default function Controls({ query, onQuery, sortKey, onSort }) {
  return (
    <div className="controls">
      <input
        className="search mono"
        type="text"
        placeholder="cari koin atau simbol..."
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        aria-label="Cari koin"
      />
      <div className="sort-group" role="group" aria-label="Urutkan berdasarkan">
        {[
          { key: 'market_cap', label: 'Kap. Pasar' },
          { key: 'price_change_percentage_24h', label: '24j %' },
          { key: 'total_volume', label: 'Volume' },
        ].map((opt) => (
          <button
            key={opt.key}
            className={`sort-btn mono ${sortKey === opt.key ? 'sort-btn-active' : ''}`}
            onClick={() => onSort(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
