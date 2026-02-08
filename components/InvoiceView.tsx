
import React from 'react';
import { motion } from 'framer-motion';
import { CartItem } from '../types';

interface InvoiceViewProps {
  items: CartItem[];
  totals: { subtotal: number; vat: number; total: number };
  deliveryFee: number;
  vatRate: number;
  onClear: () => void;
  onCheckout: () => void;
  onUpdateDeliveryFee: (fee: number) => void;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ 
  items, totals, deliveryFee, vatRate, onClear, onCheckout, onUpdateDeliveryFee 
}) => {
  return (
    <div className="glass rounded-[2rem] p-6 border-white/10 shadow-2xl relative group">
      <div className="absolute top-0 right-0 p-8 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative">
        <h3 className="text-lg font-bold tracking-tight font-jakarta text-white/90">Order Summary</h3>
        <button 
          onClick={onClear}
          className="text-[10px] font-black tracking-widest text-white/20 uppercase hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4 max-h-[250px] overflow-y-auto no-scrollbar">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-white/10 font-medium font-jakarta">Tray is currently empty</p>
          </div>
        ) : (
          items.map((it) => (
            <motion.div 
              layout
              key={it.sku} 
              className="flex justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate text-white/80">{it.name}</div>
                <div className="text-[10px] text-white/30 font-bold uppercase">
                  {it.qty} × ${it.price.toFixed(2)}
                </div>
              </div>
              <div className="text-sm font-bold text-white/90">
                ${(it.qty * it.price).toFixed(2)}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
        <div className="flex justify-between text-sm items-center">
          <span className="text-white/30 font-medium">Subtotal</span>
          <span className="font-bold text-white/70">${totals.subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm items-center">
          <span className="text-white/30 font-medium">Delivery Fee</span>
          <div className="flex items-center gap-2">
            <span className="text-white/20 font-bold">$</span>
            <input 
              type="number" 
              step="0.5"
              min="0"
              value={deliveryFee}
              onChange={(e) => onUpdateDeliveryFee(parseFloat(e.target.value) || 0)}
              className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right text-sm font-bold text-amber-500 outline-none focus:border-amber-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-between text-sm items-center">
          <span className="text-white/30 font-medium">Tax ({(vatRate * 100).toFixed(0)}%)</span>
          <span className="font-bold text-white/70">${totals.vat.toFixed(2)}</span>
        </div>

        <div className="pt-4 flex justify-between items-end">
          <span className="text-lg font-bold font-jakarta text-white">Total</span>
          <span className="text-2xl font-black text-amber-500 tracking-tighter">${totals.total.toFixed(2)}</span>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={items.length === 0}
        onClick={onCheckout}
        className="w-full mt-8 py-4 accent-gradient rounded-2xl text-black font-black text-[11px] uppercase tracking-widest shadow-xl disabled:opacity-20"
      >
        Complete Selection
      </motion.button>
    </div>
  );
};

export default InvoiceView;
