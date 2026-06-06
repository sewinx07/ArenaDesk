'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CreditCard, Wallet, ArrowUpRight } from 'lucide-react';

const transactions = [
  { id: '1', item: 'Energy Drink + Chips', amount: '$5.50', method: 'Cash', time: '2 min ago', status: 'completed' as const },
  { id: '2', item: 'Gaming Mouse', amount: '$29.99', method: 'Card', time: '15 min ago', status: 'completed' as const },
  { id: '3', item: 'PC Session Top-up', amount: '$10.00', method: 'Wallet', time: '30 min ago', status: 'completed' as const },
  { id: '4', item: 'Membership Renewal', amount: '$35.00', method: 'Card', time: '1 hour ago', status: 'completed' as const },
  { id: '5', item: 'Snack Combo', amount: '$8.50', method: 'Mobile', time: '2 hours ago', status: 'completed' as const },
  { id: '6', item: 'VIP Room Booking', amount: '$25.00', method: 'Card', time: '3 hours ago', status: 'completed' as const },
];

const methodIcons: Record<string, React.ReactNode> = {
  Cash: <Wallet className="h-4 w-4" />,
  Card: <CreditCard className="h-4 w-4" />,
  Wallet: <Wallet className="h-4 w-4" />,
  Mobile: <ShoppingCart className="h-4 w-4" />,
};

export default function RecentTransactionsWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <p className="text-sm text-surface-400 mt-1">Latest payments</p>
        </div>
        <button className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors">
          View all <ArrowUpRight className="h-3 w-3" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-lg p-2.5 hover:bg-surface-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800">
                  {methodIcons[tx.method] || <ShoppingCart className="h-4 w-4 text-surface-400" />}
                </div>
                <div>
                  <p className="text-sm text-white">{tx.item}</p>
                  <p className="text-xs text-surface-500">{tx.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{tx.amount}</span>
                <Badge variant="success" size="sm">{tx.method}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
