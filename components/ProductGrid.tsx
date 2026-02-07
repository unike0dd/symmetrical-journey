
import React, { useState } from 'react';
import { Product, CartItem, Category } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  onUpdate: (product: Product, delta: number) => void;
  cartItems: Map<string, CartItem>;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, categories, onUpdate, cartItems }) => {
  const [filter, setFilter] = useState<Category | 'ALL'>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const allFilters: (Category | 'ALL')[] = ['ALL', ...categories];
  const filtered = products.filter(p => filter === 'ALL' || p.category === filter);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {allFilters.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
              filter === c 
                ? 'accent-gradient text-black border-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.2)]' 
                : 'glass text-white/40 border-white/5 hover:border-white/10'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => {
          const qty = cartItems.get(p.sku)?.qty || 0;
          return (
            <motion.div 
              layout
              key={p.sku} 
              className="group relative glass rounded-[2.5rem] p-4 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
              onClick={() => setSelectedProduct(p)}
            >
              <div className="aspect-square rounded-[2rem] overflow-hidden mb-5 relative">
                <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`Premium selection: ${p.name}`} />
                <div className="absolute top-4 right-4 glass-dark px-3 py-1.5 rounded-xl text-[11px] font-black text-amber-500 shadow-2xl">
                  ${p.price.toFixed(2)}
                </div>
              </div>

              <div className="px-2 space-y-1.5 mb-6">
                <div className="text-[9px] font-black tracking-[0.2em] text-white/20 uppercase">{p.category}</div>
                <h4 className="font-bold text-white text-base tracking-tight leading-tight group-hover:text-amber-500 transition-colors">{p.name}</h4>
              </div>

              <div className="flex items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 bg-black/60 rounded-2xl p-1 border border-white/5 flex-1">
                  <button 
                    onClick={() => onUpdate(p, -1)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors text-white/20 hover:text-white"
                  >−</button>
                  <span className="text-xs font-black w-4 text-center">{qty}</span>
                  <button 
                    onClick={() => onUpdate(p, 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors text-amber-500"
                  >+</button>
                </div>
                
                <button 
                  onClick={() => onUpdate(p, 1)}
                  className="w-11 h-11 flex items-center justify-center rounded-[1.2rem] accent-gradient text-black shadow-xl shadow-amber-500/10 active:scale-90"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl glass rounded-[3rem] overflow-hidden flex flex-col md:flex-row relative"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-2xl glass flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="w-full md:w-1/2 aspect-square md:aspect-auto">
                <img src={selectedProduct.image_url} className="w-full h-full object-cover" alt={`High resolution view of ${selectedProduct.name}`} />
              </div>

              <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                    {selectedProduct.category} Selection
                  </div>
                  <h3 className="text-4xl font-black text-white tracking-tighter leading-tight">{selectedProduct.name}</h3>
                  <p className="text-white/40 text-sm font-medium leading-relaxed">
                    {selectedProduct.description || "A masterfully crafted selection from [The best cafeteria in the North], designed for the most discerning palates."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Premium Valuation</span>
                    <div className="text-3xl font-black text-amber-500 tracking-tighter">${selectedProduct.price.toFixed(2)}</div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      onUpdate(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                    className="px-10 py-5 accent-gradient rounded-[1.5rem] text-black font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                  >
                    Select for Tray
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;
