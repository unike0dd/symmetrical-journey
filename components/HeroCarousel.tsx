
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, CartItem } from '../types';

interface HeroCarouselProps {
  combos: Product[];
  onUpdate: (product: Product, delta: number) => void;
  cartItems: Map<string, CartItem>;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ combos, onUpdate, cartItems }) => {
  const [index, setIndex] = useState(0);

  if (combos.length === 0) return (
    <div className="glass aspect-[21/9] rounded-[2rem] flex items-center justify-center text-white/20 italic">
      No featured selections currently available.
    </div>
  );

  const next = () => setIndex((i) => (i + 1) % combos.length);
  const prev = () => setIndex((i) => (i - 1 + combos.length) % combos.length);

  const currentProduct = combos[index];
  const qty = cartItems.get(currentProduct.sku)?.qty || 0;

  return (
    <div className="relative group overflow-hidden rounded-[2.5rem]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProduct.sku}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="aspect-[21/9] md:aspect-[24/9] lg:aspect-[32/10] relative"
        >
          <img 
            src={currentProduct.image_url} 
            className="w-full h-full object-cover" 
            alt={`Featured high-end selection: ${currentProduct.name}. ${currentProduct.description}`} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="space-y-2 max-w-xl">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20 mb-2">
                Executive Chef Selection
              </span>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{currentProduct.name}</h3>
              <p className="text-white/60 text-sm md:text-base font-medium max-w-md">{currentProduct.description}</p>
            </div>
            
            <div className="flex items-center gap-6 glass-dark px-8 py-5 rounded-[2rem] border-white/10">
              <div className="text-center pr-6 border-r border-white/10">
                <div className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Valuation</div>
                <div className="text-3xl font-black text-amber-500 tracking-tighter">${currentProduct.price.toFixed(2)}</div>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onUpdate(currentProduct, -1)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl glass hover:bg-white/5 transition-colors text-xl font-bold"
                >
                  −
                </motion.button>
                <span className="w-8 text-center font-black text-2xl text-white">{qty}</span>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onUpdate(currentProduct, 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl glass hover:bg-white/5 transition-colors text-xl font-bold text-amber-500"
                >
                  +
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 active:scale-90 z-20">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 active:scale-90 z-20">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {combos.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-amber-500' : 'w-2 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
