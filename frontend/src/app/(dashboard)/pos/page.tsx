'use client';

import React from 'react';
import { ShoppingCart, TrendingUp, DollarSign, Receipt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import POSInterface from '@/components/pos/POSInterface';

export default function POSPage() {
  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Point of Sale</h1>
          <p className="text-sm text-surface-400 mt-1">
            Sell snacks, drinks, merchandise, and manage transactions.
          </p>
        </div>
        <div className="flex gap-2">
          <Card className="!bg-surface-800/30 !border-surface-700/30">
            <CardContent className="p-3 flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-xs text-surface-500">Today</p>
                <p className="text-sm font-bold text-white">$847.50</p>
              </div>
            </CardContent>
          </Card>
          <Card className="!bg-surface-800/30 !border-surface-700/30">
            <CardContent className="p-3 flex items-center gap-3">
              <Receipt className="h-5 w-5 text-primary-400" />
              <div>
                <p className="text-xs text-surface-500">Orders</p>
                <p className="text-sm font-bold text-white">24</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <POSInterface />
    </div>
  );
}
