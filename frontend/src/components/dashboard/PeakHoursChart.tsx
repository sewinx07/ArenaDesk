'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { hour: '8 AM', utilization: 15 },
  { hour: '9 AM', utilization: 25 },
  { hour: '10 AM', utilization: 35 },
  { hour: '11 AM', utilization: 40 },
  { hour: '12 PM', utilization: 55 },
  { hour: '1 PM', utilization: 60 },
  { hour: '2 PM', utilization: 65 },
  { hour: '3 PM', utilization: 75 },
  { hour: '4 PM', utilization: 85 },
  { hour: '5 PM', utilization: 90 },
  { hour: '6 PM', utilization: 95 },
  { hour: '7 PM', utilization: 88 },
  { hour: '8 PM', utilization: 80 },
  { hour: '9 PM', utilization: 65 },
  { hour: '10 PM', utilization: 45 },
  { hour: '11 PM', utilization: 30 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-surface-700 bg-surface-900 p-3 shadow-xl shadow-black/30">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-sm text-cyan-400">Utilization: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function PeakHoursChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Peak Hours</CardTitle>
        <p className="text-sm text-surface-400 mt-1">PC utilization by hour</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="hour"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="utilization"
                fill="#06B6D4"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
