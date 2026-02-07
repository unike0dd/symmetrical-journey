
import React, { useMemo } from 'react';
import { Product, CartItem } from '../types';

interface RecommendationEngineProps {
  cartItems: CartItem[];
  allProducts: Product[];
  onAdd: (product: Product, delta: number) => void;
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({ cartItems, allProducts, onAdd }) => {
  const recommendations = useMemo(() => {
    if (cartItems.length === 0) return [];
    
    // Find the most expensive item in the tray
    const premiumItem = [...cartItems].sort((a, b) => b.price - a.price)[0];
    const premiumProduct = allProducts.find(p => p.sku === premiumItem.sku);
    
    if (!premiumProduct) return [];

    let suggested: Product[] = [];

    // Logic: Complement the premium choice
    if (premiumProduct.category === 'COMBO') {
      // Combos are full meals, suggest premium drinks or snacks
      suggested.push(...allProducts.filter(p => p.category === 'DRINK' || p.category === 'COFFEE'));
    } else if (premiumProduct.category === 'COFFEE' || premiumProduct.category === 'TEA') {
      // Suggest high-end snacks to pair with the beverage
      suggested.push(...allProducts.filter(p => p.category === 'SNACK'));
    } else if (premiumProduct.category === 'SNACK') {
      // Suggest a refreshment
      suggested.push(...allProducts.filter(p => p.category === 'DRINK' || p.category === 'TEA'));
    } else {
      // General sophisticated suggestions
      suggested.push(...allProducts.filter(p => p.active));
    }

    // Filter out items already in cart and ensure they are active
    const cartSkus = new Set(cartItems.map(it => it.sku));
    return suggested
      .filter(p => !cartSkus.has(p.sku) && p.active)
      .sort((a, b) => b.price - a.price) // Suggest premium complements first
      .slice(0, 3);
  }, [cartItems, allProducts]);

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[10px] font-black tracking-widest uppercase text-white/30">Artisan Recommendations</h4>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {recommendations.map(p => (
          <div key={p.sku} className="flex items-center gap-4 p-3 glass rounded-2xl border-white/5 hover:border-white/10 transition-all group">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{p.name}</div>
              <div className="text-amber-500 text-[10px] font-black uppercase tracking-tighter">${p.price.toFixed(2)}</div>
            </div>
            <button 
              onClick={() => onAdd(p, 1)}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all active:scale-90 border border-white/5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationEngine;
