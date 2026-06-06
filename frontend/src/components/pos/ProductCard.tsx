'use client';

import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <button
      onClick={() => onAddToCart(product)}
      className="group relative flex flex-col rounded-xl border border-surface-700/50 bg-surface-900/50 p-4 text-left hover:border-primary-600/30 hover:bg-surface-900/80 transition-all duration-200 hover:shadow-lg hover:shadow-primary-600/5"
    >
      <div className="flex h-20 w-full items-center justify-center rounded-lg bg-surface-800/50 mb-3 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <ShoppingCart className="h-8 w-8 text-surface-600" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-surface-500 mt-1 line-clamp-1">{product.description}</p>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-700/30">
        <span className="text-lg font-bold text-white">
          ${product.price.toFixed(2)}
        </span>
        <Button
          size="icon"
          variant="cyan"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {product.stock <= 5 && product.stock > 0 && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center rounded-full bg-amber-600/20 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-600/30">
            {product.stock} left
          </span>
        </div>
      )}

      {product.stock === 0 && (
        <div className="absolute inset-0 rounded-xl bg-surface-950/80 flex items-center justify-center backdrop-blur-sm">
          <span className="text-sm font-medium text-surface-500">Out of Stock</span>
        </div>
      )}
    </button>
  );
}
