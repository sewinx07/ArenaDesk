import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface UsageDataPoint {
  time: string;
  cpu: number;
  ram: number;
  gpu: number;
}

interface UsageChartProps {
  pcId: string;
}

const UsageChart: React.FC<UsageChartProps> = ({ pcId }) => {
  const [data, setData] = useState<UsageDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<'5m' | '15m' | '30m' | '1h'>('5m');
  const maxPoints = timeRange === '5m' ? 30 : timeRange === '15m' ? 90 : timeRange === '30m' ? 180 : 360;

  useEffect(() => {
    const initialData: UsageDataPoint[] = [];
    const now = new Date();
    for (let i = maxPoints; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 10000);
      initialData.push({
        time: t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cpu: 20 + Math.random() * 40,
        ram: 30 + Math.random() * 30,
        gpu: 15 + Math.random() * 45,
      });
    }
    setData(initialData);
  }, [pcId, maxPoints, timeRange]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newPoint: UsageDataPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpu: 20 + Math.random() * 40,
          ram: 30 + Math.random() * 30,
          gpu: 15 + Math.random() * 45,
        };
        const updated = [...prev, newPoint];
        if (updated.length > maxPoints + 1) {
          return updated.slice(updated.length - maxPoints - 1);
        }
        return updated;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [maxPoints]);

  const timeRanges: { label: string; value: '5m' | '15m' | '30m' | '1h' }[] = [
    { label: '5 min', value: '5m' },
    { label: '15 min', value: '15m' },
    { label: '30 min', value: '30m' },
    { label: '1 hour', value: '1h' },
  ];

  return (
    <div className="usage-chart-container">
      <div className="usage-chart-header">
        <h3>Usage History</h3>
        <div className="time-range-selector">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              className={`time-range-btn ${timeRange === range.value ? 'active' : ''}`}
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <div className="usage-chart">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D44" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#2D2D44' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#2D2D44' }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: '#1A1A2E',
                border: '1px solid #8B5CF6',
                borderRadius: '8px',
                color: '#E2E8F0',
                fontSize: '12px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }}
            />
            <Line
              type="monotone"
              dataKey="cpu"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
              name="CPU"
            />
            <Line
              type="monotone"
              dataKey="ram"
              stroke="#06B6D4"
              strokeWidth={2}
              dot={false}
              name="RAM"
            />
            <Line
              type="monotone"
              dataKey="gpu"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="GPU"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsageChart;
