import { useEffect, useRef, useState } from 'react';

const ENDPOINT =
  'https://api.coingecko.com/api/v3/coins/markets' +
  '?vs_currency=usd&order=market_cap_desc&per_page=60&page=1' +
  '&sparkline=true&price_change_percentage=1h,24h,7d';

const REFRESH_MS = 60_000;

export function useMarkets() {
  const [coins, setCoins] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error
  const [lastUpdated, setLastUpdated] = useState(null);
  const timerRef = useRef(null);

  async function load(isFirst) {
    try {
      if (isFirst) setStatus('loading');
      const res = await fetch(ENDPOINT);
      if (!res.ok) throw new Error('Request gagal: ' + res.status);
      const data = await res.json();
      setCoins(data);
      setStatus('ok');
      setLastUpdated(new Date());
    } catch (err) {
      setStatus('error');
    }
  }

  useEffect(() => {
    load(true);
    timerRef.current = setInterval(() => load(false), REFRESH_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  return { coins, status, lastUpdated, reload: () => load(true) };
}
