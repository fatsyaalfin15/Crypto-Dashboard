import { formatCompact, formatPercent, formatUsd } from '../utils/format';
import Sparkline from './Sparkline';

export default function MarketTable({ coins, onSelect }) {
  if (coins.length === 0) {
    return <p className="empty-state mono">tidak ada koin yang cocok.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="market-table">
        <thead>
          <tr>
            <th className="col-rank">#</th>
            <th className="col-name">Koin</th>
            <th className="col-num">Harga</th>
            <th className="col-num">1j</th>
            <th className="col-num">24j</th>
            <th className="col-num">7h</th>
            <th className="col-num">Kap. Pasar</th>
            <th className="col-chart">7 Hari</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((c) => {
            const change24h = c.price_change_percentage_24h || 0;
            const change1h =
              c.price_change_percentage_1h_in_currency || 0;
            const change7d =
              c.price_change_percentage_7d_in_currency || 0;

            return (
              <tr
                key={c.id}
                className="market-row"
                onClick={() => onSelect(c)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => e.key === 'Enter' && onSelect(c)}
              >
                <td className="col-rank mono">{c.market_cap_rank ?? '—'}</td>
                <td className="col-name">
                  <img src={c.image} alt="" width={20} height={20} />
                  <div>
                    <span className="coin-name">{c.name}</span>
                    <span className="coin-symbol mono">
                      {c.symbol.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="col-num mono">{formatUsd(c.current_price)}</td>
                <td className={`col-num mono ${change1h >= 0 ? 'up' : 'down'}`}>
                  {formatPercent(change1h)}
                </td>
                <td className={`col-num mono ${change24h >= 0 ? 'up' : 'down'}`}>
                  {formatPercent(change24h)}
                </td>
                <td className={`col-num mono ${change7d >= 0 ? 'up' : 'down'}`}>
                  {formatPercent(change7d)}
                </td>
                <td className="col-num mono">
                  {formatCompact(c.market_cap)}
                </td>
                <td className="col-chart">
                  <Sparkline
                    data={c.sparkline_in_7d?.price}
                    positive={change7d >= 0}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
