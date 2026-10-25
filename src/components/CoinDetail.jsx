import { useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useCoinChart } from '../hooks/useCoinChart';
import { formatPercent, formatUsd, formatCompact } from '../utils/format';

const RANGES = [
  { label: '24J', days: 1 },
  { label: '7H', days: 7 },
  { label: '30H', days: 30 },
  { label: '1T', days: 365 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const date = new Date(label);
  return (
    <div className="chart-tooltip mono">
      <div>{date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</div>
      <div className="chart-tooltip-price">{formatUsd(payload[0].value)}</div>
    </div>
  );
}

export default function CoinDetail({ coin, onClose }) {
  const [days, setDays] = useState(7);
  const { points, status } = useCoinChart(coin.id, days);

  const change24h = coin.price_change_percentage_24h || 0;
  const first = points[0]?.price;
  const last = points[points.length - 1]?.price;
  const rangeChange = first && last ? ((last - first) / first) * 100 : null;
  const positive = (rangeChange ?? change24h) >= 0;

  return (
    <aside className="detail-panel" aria-label={`Detail ${coin.name}`}>
      <div className="detail-header">
        <div className="detail-title">
          <img src={coin.image} alt="" width={28} height={28} />
          <div>
            <h2>{coin.name}</h2>
            <span className="coin-symbol mono">{coin.symbol.toUpperCase()}</span>
          </div>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Tutup detail">
          ✕
        </button>
      </div>

      <div className="detail-price">
        <span className="price-big mono">{formatUsd(coin.current_price)}</span>
        <span className={`price-change mono ${change24h >= 0 ? 'up' : 'down'}`}>
          {formatPercent(change24h)} (24j)
        </span>
      </div>

      <div className="range-group" role="group" aria-label="Rentang waktu">
        {RANGES.map((r) => (
          <button
            key={r.days}
            className={`range-btn mono ${days === r.days ? 'range-btn-active' : ''}`}
            onClick={() => setDays(r.days)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="detail-chart">
        {status === 'loading' && <p className="mono chart-msg">memuat grafik...</p>}
        {status === 'error' && <p className="mono chart-msg">gagal memuat grafik.</p>}
        {status === 'ok' && points.length > 1 && (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={points}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={positive ? 'var(--signal)' : 'var(--alert)'}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor={positive ? 'var(--signal)' : 'var(--alert)'}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={positive ? 'var(--signal)' : 'var(--alert)'}
                strokeWidth={1.75}
                fill="url(#fill)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <dl className="detail-stats mono">
        <div>
          <dt>Kap. Pasar</dt>
          <dd>{formatCompact(coin.market_cap)}</dd>
        </div>
        <div>
          <dt>Volume 24j</dt>
          <dd>{formatCompact(coin.total_volume)}</dd>
        </div>
        <div>
          <dt>Tertinggi 24j</dt>
          <dd>{formatUsd(coin.high_24h)}</dd>
        </div>
        <div>
          <dt>Terendah 24j</dt>
          <dd>{formatUsd(coin.low_24h)}</dd>
        </div>
        <div>
          <dt>Peringkat</dt>
          <dd>#{coin.market_cap_rank ?? '—'}</dd>
        </div>
        <div>
          <dt>Suplai Beredar</dt>
          <dd>{formatCompact(coin.circulating_supply)}</dd>
        </div>
      </dl>
    </aside>
  );
}
