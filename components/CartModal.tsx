
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem, Product } from '../types';
import RecommendationEngine from './RecommendationEngine';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totals: { subtotal: number; vat: number; total: number };
  deliveryFee: number;
  onUpdate: (product: any, delta: number) => void;
  onClear: () => void;
  onOrderPlaced: (items: CartItem[], total: number) => void;
  products: Product[];
}

const CartModal: React.FC<CartModalProps> = ({ 
  isOpen, onClose, items, totals, deliveryFee, onUpdate, onClear, onOrderPlaced, products 
}) => {
  const [customer, setCustomer] = useState({ name: '', email: '' });
  const [orderStatus, setOrderStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');

  const handleSubmit = async () => {
    if (!customer.name || !customer.email) return;
    setOrderStatus('PROCESSING');
    
    // Simulate prep cycle
    setTimeout(() => {
      onOrderPlaced(items, totals.total);
      setOrderStatus('SUCCESS');
      setTimeout(() => {
        onClear();
        onClose();
        setOrderStatus('IDLE');
      }, 3000);
    }, 2000); // 2s processing time for chef simulation
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-2xl glass rounded-t-[2.5rem] md:rounded-[2.5rem] border-white/10 shadow-3xl overflow-hidden"
      >
        <div className="p-8 md:p-12 space-y-8 max-h-[90vh] overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-white">Your Tray</h2>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Selected Delights</p>
            </div>
            <button 
              onClick={onClose} 
              disabled={orderStatus === 'PROCESSING'}
              className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-20"
            >
              <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {orderStatus === 'PROCESSING' ? (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="text-center py-24 space-y-8"
              >
                <div className="relative w-20 h-20 mx-auto">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-amber-500 rounded-full"
                  />
                  <div className="absolute inset-2 border border-white/5 rounded-full" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tighter text-white uppercase">Validating Order</h3>
                  <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Coordinating with kitchen staff...</p>
                </div>
              </motion.div>
            ) : orderStatus === 'SUCCESS' ? (
              <motion.div 
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-teal-500/30 shadow-[0_0_40px_rgba(20,184,166,0.2)]">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 tracking-tight">Experience Secured</h3>
                <p className="text-white/60 text-sm">Our artisans have begun preparing your selection.</p>
              </motion.div>
            ) : (
              <motion.div key="form" className="space-y-8">
                <div className="space-y-4">
                  {items.length === 0 ? (
                    <p className="text-center py-10 text-white/20 font-medium italic">The tray is awaiting its first selection.</p>
                  ) : (
                    <AnimatePresence initial={false}>
                      {items.map((it) => (
                        <motion.div 
                          key={it.sku} 
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                          className="flex items-center justify-between gap-4 p-4 glass rounded-2xl border-white/5"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm truncate text-white/90">{it.name}</div>
                            <div className="text-amber-500 text-xs font-black tracking-tight">${it.price.toFixed(2)}</div>
                          </div>
                          <div className="flex items-center gap-4 bg-black/40 rounded-xl p-1 border border-white/5">
                            <button 
                              onClick={() => onUpdate({ sku: it.sku, name: it.name, price: it.price }, -1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/40"
                            >−</button>
                            <span className="text-sm font-bold w-6 text-center text-white/80">{it.qty}</span>
                            <button 
                              onClick={() => onUpdate({ sku: it.sku, name: it.name, price: it.price }, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-amber-500"
                            >+</button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>

                {items.length > 0 && (
                  <RecommendationEngine 
                    cartItems={items}
                    allProducts={products}
                    onAdd={onUpdate}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Guest Designation</label>
                    <input 
                      type="text"
                      placeholder="Ex: Alexander Pierce"
                      value={customer.name}
                      onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Correspondence</label>
                    <input 
                      type="email"
                      placeholder="Ex: alex@example.com"
                      value={customer.email}
                      onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-white/10"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="text-white/40 text-[10px] font-black tracking-widest uppercase">Investment Total</div>
                      <div className="text-4xl font-black text-white tracking-tighter">${totals.total.toFixed(2)}</div>
                    </div>
                    <button 
                      disabled={!customer.name || !customer.email || items.length === 0}
                      onClick={handleSubmit}
                      className="px-10 py-5 accent-gradient rounded-[1.5rem] text-black font-black text-sm uppercase tracking-widest shadow-2xl shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-10"
                    >
                      Establish Order
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CartModal;
