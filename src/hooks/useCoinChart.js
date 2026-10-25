import { useEffect, useState } from 'react';

export function useCoinChart(coinId, days) {
  const [points, setPoints] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!coinId) return;
    let cancelled = false;
    setStatus('loading');

    const url =
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart` +
      `?vs_currency=usd&days=${days}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Request gagal: ' + res.status);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const mapped = (data.prices || []).map(([t, price]) => ({
          t,
          price,
        }));
        setPoints(mapped);
        setStatus('ok');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [coinId, days]);

  return { points, status };
}
