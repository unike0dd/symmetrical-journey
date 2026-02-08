
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
    <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProduct.sku}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col md:flex-row min-h-[360px] md:min-h-[420px] lg:min-h-[460px]"
        >
          <div className="relative md:w-3/5">
            <img 
              src={currentProduct.image_url} 
              className="w-full h-full object-cover" 
              alt={`Featured high-end selection: ${currentProduct.name}. ${currentProduct.description}`} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                  {currentProduct.category || 'Signature'}
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter mt-3">{currentProduct.name}</h3>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-[9px] font-black uppercase tracking-widest">Investment</div>
                <div className="text-2xl md:text-3xl font-black text-amber-400 tracking-tighter">${currentProduct.price.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="md:w-2/5 flex flex-col justify-between gap-8 p-8 md:p-10 bg-black/40 backdrop-blur-xl"
          >
            <div className="space-y-4">
              <div className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em]">Chef Series</div>
              <p className="text-white/80 text-sm md:text-base font-medium">{currentProduct.description}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-white/70 text-xs font-semibold">
                <span>In cart</span>
                <span className="text-lg font-black text-white">{qty}</span>
              </div>
              <div className="flex items-center gap-4">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onUpdate(currentProduct, -1)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl glass hover:bg-white/5 transition-colors text-xl font-bold"
                >
                  −
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onUpdate(currentProduct, 1)}
                  className="flex-1 px-6 py-3 rounded-full bg-amber-500 text-black text-xs font-black uppercase tracking-[0.25em] hover:bg-amber-400 transition-colors"
                >
                  Add to Order
                </motion.button>
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

      <button onClick={prev} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full glass flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 active:scale-90 z-20">
        <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={next} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full glass flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 active:scale-90 z-20">
        <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
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
