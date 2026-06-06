'use client';

import React from 'react';
import { Trash2, Minus, Plus, ShoppingBag, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { OrderItem, PaymentMethod, Product } from '@/types';

interface CartSummaryProps {
  items: OrderItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (paymentMethod: PaymentMethod) => void;
  onClearCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
}

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'mobile_payment', label: 'Mobile Pay' },
  { value: 'wallet', label: 'Wallet' },
];

export default function CartSummary({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onClearCart,
  subtotal,
  tax,
  total,
}: CartSummaryProps) {
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>('cash');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/50">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary-400" />
          <h3 className="text-sm font-medium text-white">
            Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
          </h3>
        </div>
        {items.length > 0 && (
          <button onClick={onClearCart} className="text-xs text-red-400 hover:text-red-300">
            Clear all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-800 mb-3">
              <ShoppingBag className="h-8 w-8 text-surface-600" />
            </div>
            <p className="text-sm text-surface-500">Cart is empty</p>
            <p className="text-xs text-surface-600 mt-1">Select products to add</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-3 rounded-lg bg-surface-800/30 p-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.productName}</p>
                <p className="text-xs text-surface-500">${item.unitPrice.toFixed(2)} each</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateQuantity(item.productId, Math.max(0, item.quantity - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700 transition-all"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700 transition-all"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <div className="text-right min-w-[60px]">
                <p className="text-sm font-medium text-white">${item.totalPrice.toFixed(2)}</p>
              </div>

              <button
                onClick={() => onRemoveItem(item.productId)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-surface-700/50 p-4 space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Subtotal</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Tax (8%)</span>
              <span className="text-white">${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span className="text-white">Total</span>
              <span className="text-primary-400">${total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-400 mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.value}
                  onClick={() => setSelectedMethod(method.value)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                    selectedMethod === method.value
                      ? 'border-primary-600/50 bg-primary-600/10 text-primary-400'
                      : 'border-surface-700/50 text-surface-400 hover:border-surface-600'
                  )}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            variant="gradient"
            size="lg"
            onClick={() => onCheckout(selectedMethod)}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Charge ${total.toFixed(2)}
          </Button>
        </div>
      )}
    </div>
  );
}
