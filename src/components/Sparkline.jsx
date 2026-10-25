import { Line, LineChart, ResponsiveContainer } from 'recharts';

export default function Sparkline({ data, positive }) {
  if (!data || data.length < 2) {
    return <div className="sparkline-empty mono">n/a</div>;
  }
  const points = data.map((price, i) => ({ i, price }));
  const color = positive ? 'var(--signal)' : 'var(--alert)';

  return (
    <ResponsiveContainer width={110} height={36}>
      <LineChart data={points}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
