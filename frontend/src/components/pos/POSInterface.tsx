'use client';

import React, { useState } from 'react';
import { Search, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProductCard from './ProductCard';
import CartSummary from './CartSummary';
import { toast } from '@/components/ui/toast';
import type { Product, OrderItem, PaymentMethod } from '@/types';

const categories = [
  { id: 'all', label: 'All Items' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'merchandise', label: 'Merchandise' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'memberships', label: 'Memberships' },
];

const sampleProducts: Product[] = [
  { id: '1', cafeId: '1', name: 'Energy Drink', description: 'Refreshing energy boost', price: 3.50, cost: 1.50, category: 'drinks', stock: 50, isActive: true, createdAt: '', updatedAt: '' },
  { id: '2', cafeId: '1', name: 'Potato Chips', description: 'Classic salted chips', price: 2.00, cost: 0.80, category: 'snacks', stock: 40, isActive: true, createdAt: '', updatedAt: '' },
  { id: '3', cafeId: '1', name: 'Gaming Mouse Pad', description: 'Large RGB mouse pad', price: 24.99, cost: 10.00, category: 'accessories', stock: 15, isActive: true, createdAt: '', updatedAt: '' },
  { id: '4', cafeId: '1', name: 'T-Shirt Logo', description: 'ArenaDesk OS T-Shirt', price: 29.99, cost: 12.00, category: 'merchandise', stock: 20, isActive: true, createdAt: '', updatedAt: '' },
  { id: '5', cafeId: '1', name: 'Gaming Headset', description: 'Pro gaming headset', price: 79.99, cost: 35.00, category: 'accessories', stock: 8, isActive: true, createdAt: '', updatedAt: '' },
  { id: '6', cafeId: '1', name: 'Chocolate Bar', description: 'Premium dark chocolate', price: 2.50, cost: 1.00, category: 'snacks', stock: 5, isActive: true, createdAt: '', updatedAt: '' },
  { id: '7', cafeId: '1', name: 'Cola', description: 'Refreshing cola drink', price: 1.50, cost: 0.50, category: 'drinks', stock: 100, isActive: true, createdAt: '', updatedAt: '' },
  { id: '8', cafeId: '1', name: 'Pro Controller', description: 'Wireless pro controller', price: 59.99, cost: 25.00, category: 'accessories', stock: 0, isActive: true, createdAt: '', updatedAt: '' },
  { id: '9', cafeId: '1', name: 'Membership - Silver', description: '1 month silver tier', price: 35.00, cost: 0, category: 'memberships', stock: 999, isActive: true, createdAt: '', updatedAt: '' },
  { id: '10', cafeId: '1', name: 'Bottled Water', description: 'Natural spring water', price: 1.00, cost: 0.30, category: 'drinks', stock: 72, isActive: true, createdAt: '', updatedAt: '' },
];

export default function POSInterface() {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = sampleProducts.filter(
    (p) =>
      (activeCategory === 'all' || p.category === activeCategory) &&
      (searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price,
          totalPrice: product.price,
        },
      ];
    });
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    toast.info('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = (paymentMethod: PaymentMethod) => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    toast.success(`Payment of $${total.toFixed(2)} via ${paymentMethod} successful!`);
    setCartItems([]);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="flex-1 flex flex-col rounded-xl border border-surface-700/50 bg-surface-900/30 overflow-hidden">
        <div className="p-4 border-b border-surface-700/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-surface-700/50 bg-surface-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex rounded-lg border border-surface-700/50 p-0.5 bg-surface-800/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-1.5 ${viewMode === 'grid' ? 'bg-surface-700 text-white' : 'text-surface-400 hover:text-white'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-md p-1.5 ${viewMode === 'list' ? 'bg-surface-700 text-white' : 'text-surface-400 hover:text-white'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                    : 'bg-surface-800/50 text-surface-400 border border-transparent hover:text-surface-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border border-surface-700/30 bg-surface-800/30 p-3 hover:bg-surface-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800">
                      <span className="text-lg">📦</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{product.name}</p>
                      <p className="text-xs text-surface-500">{product.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-white">${product.price.toFixed(2)}</span>
                    <Badge variant={product.stock > 5 ? 'success' : product.stock > 0 ? 'warning' : 'danger'} size="sm">
                      {product.stock > 0 ? `${product.stock}` : 'OOS'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="cyan"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-96 flex-shrink-0 rounded-xl border border-surface-700/50 bg-surface-900/50 overflow-hidden">
        <CartSummary
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={handleCheckout}
          onClearCart={clearCart}
          subtotal={subtotal}
          tax={tax}
          total={total}
        />
      </div>
    </div>
  );
}
