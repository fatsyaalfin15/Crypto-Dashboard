import { useMemo, useState } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useCoinChart } from '../hooks/useCoinChart';
import { formatCompact, formatPercent, formatUsd } from '../utils/format';

const RANGES = [
  { label: '7H', days: 7 },
  { label: '30H', days: 30 },
  { label: '1T', days: 365 },
];

const COLOR_A = 'var(--signal)';
const COLOR_B = 'var(--amber)';

function CoinPicker({ label, coins, value, onChange, color }) {
  return (
    <label className="picker">
      <span className="picker-label mono" style={{ color }}>
        {label}
      </span>
      <select
        className="picker-select mono"
        value={value?.id || ''}
        onChange={(e) =>
          onChange(coins.find((c) => c.id === e.target.value) || null)
        }
      >
        <option value="" disabled>
          pilih koin...
        </option>
        {coins.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.symbol.toUpperCase()})
          </option>
        ))}
      </select>
    </label>
  );
}

// Normalisasi ke "% perubahan dari titik awal" supaya dua koin dengan
// skala harga sangat berbeda (mis. BTC vs token $0.001) bisa dibandingkan
// pada satu sumbu Y yang sama.
function normalize(points) {
  if (!points.length) return [];
  const base = points[0].price;
  if (!base) return [];
  return points.map((p) => ({
    t: p.t,
    pct: ((p.price - base) / base) * 100,
  }));
}

function mergeSeries(a, b) {
  const map = new Map();
  a.forEach((p) => map.set(p.t, { t: p.t, a: p.pct }));
  b.forEach((p) => {
    const existing = map.get(p.t);
    if (existing) existing.b = p.pct;
    else map.set(p.t, { t: p.t, b: p.pct });
  });
  return [...map.values()].sort((x, y) => x.t - y.t);
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const date = new Date(label);
  return (
    <div className="chart-tooltip mono">
      <div>
        {date.toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </div>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          style={{ color: p.dataKey === 'a' ? COLOR_A : COLOR_B }}
        >
          {formatPercent(p.value)}
        </div>
      ))}
    </div>
  );
}

export default function Compare({ coins }) {
  const [coinA, setCoinA] = useState(null);
  const [coinB, setCoinB] = useState(null);
  const [days, setDays] = useState(7);

  const chartA = useCoinChart(coinA?.id, days);
  const chartB = useCoinChart(coinB?.id, days);

  const merged = useMemo(() => {
    if (!coinA || !coinB) return [];
    return mergeSeries(normalize(chartA.points), normalize(chartB.points));
  }, [chartA.points, chartB.points, coinA, coinB]);

  const loading =
    (coinA && chartA.status === 'loading') ||
    (coinB && chartB.status === 'loading');

  return (
    <div className="compare">
      <div className="compare-pickers">
        <CoinPicker
          label="KOIN A"
          coins={coins}
          value={coinA}
          onChange={setCoinA}
          color={COLOR_A}
        />
        <CoinPicker
          label="KOIN B"
          coins={coins}
          value={coinB}
          onChange={setCoinB}
          color={COLOR_B}
        />
        <div className="range-group" role="group" aria-label="Rentang waktu">
          {RANGES.map((r) => (
            <button
              key={r.days}
              className={`range-btn mono ${
                days === r.days ? 'range-btn-active' : ''
              }`}
              onClick={() => setDays(r.days)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {!coinA || !coinB ? (
        <p className="empty-state mono">
          pilih dua koin untuk membandingkan performa harganya.
        </p>
      ) : (
        <>
          <div className="compare-chart">
            {loading && <p className="mono chart-msg">memuat grafik...</p>}
            {!loading && merged.length > 1 && (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={merged}>
                  <XAxis dataKey="t" hide />
                  <YAxis
                    tickFormatter={(v) => `${v.toFixed(0)}%`}
                    stroke="var(--text-faint)"
                    fontSize={11}
                    width={44}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="a"
                    stroke={COLOR_A}
                    strokeWidth={1.75}
                    dot={false}
                    isAnimationActive={false}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="b"
                    stroke={COLOR_B}
                    strokeWidth={1.75}
                    dot={false}
                    isAnimationActive={false}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            <p className="chart-caption mono">
              garis menunjukkan % perubahan dari harga awal periode, bukan
              harga mentah — supaya koin dengan skala harga berbeda bisa
              dibandingkan sewajarnya.
            </p>
          </div>

          <div className="compare-stats">
            {[coinA, coinB].map((c, i) => (
              <div className="compare-card" key={c.id}>
                <div className="compare-card-title">
                  <span
                    className="brand-mark"
                    style={{ background: i === 0 ? COLOR_A : COLOR_B }}
                  />
                  <img src={c.image} alt="" width={20} height={20} />
                  <strong>{c.name}</strong>
                  <span className="coin-symbol mono">
                    {c.symbol.toUpperCase()}
                  </span>
                </div>
                <dl className="detail-stats mono">
                  <div>
                    <dt>Harga</dt>
                    <dd>{formatUsd(c.current_price)}</dd>
                  </div>
                  <div>
                    <dt>24j</dt>
                    <dd
                      className={
                        (c.price_change_percentage_24h || 0) >= 0
                          ? 'up'
                          : 'down'
                      }
                    >
                      {formatPercent(c.price_change_percentage_24h)}
                    </dd>
                  </div>
                  <div>
                    <dt>Kap. Pasar</dt>
                    <dd>{formatCompact(c.market_cap)}</dd>
                  </div>
                  <div>
                    <dt>Peringkat</dt>
                    <dd>#{c.market_cap_rank ?? '—'}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}