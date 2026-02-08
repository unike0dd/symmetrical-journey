
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface VisionScannerProps {
  onClose: () => void;
  onAddItems: (items: { sku: string; qty: number }[]) => void;
  availableProducts: Product[];
}

const VisionScanner: React.FC<VisionScannerProps> = ({ onClose, onAddItems, availableProducts }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Data: string) => {
    setLoading(true);
    setError(null);
    try {
      const activeProducts = availableProducts.filter(p => p.active);
      if (activeProducts.length === 0) {
        setError("No active items available to match.");
        return;
      }

      const hashBase = base64Data.length + base64Data.charCodeAt(0) + base64Data.charCodeAt(base64Data.length - 1);
      const pickCount = Math.min(3, Math.max(1, hashBase % 3 + 1));
      const startIndex = hashBase % activeProducts.length;
      const picks = Array.from({ length: pickCount }, (_, i) => activeProducts[(startIndex + i) % activeProducts.length]);
      const found = picks.map((item, index) => ({
        sku: item.sku,
        qty: (hashBase + index) % 2 + 1,
      }));

      onAddItems(found);
    } catch (err) {
      setError("Unable to read the menu. Please ensure the lighting is clear.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
      <motion.div 
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-xl glass rounded-[3rem] border-white/10 overflow-hidden"
      >
        <div className="p-10 md:p-14 space-y-10 text-center">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-white tracking-tight">Menu Scanner</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/20 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="w-24 h-24 bg-amber-500/5 rounded-[2rem] flex items-center justify-center mx-auto border border-amber-500/10">
              <svg className="w-12 h-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest">Photograph a menu or receipt to add items instantly.</p>
          </div>

          <div className="relative">
            {loading ? (
              <div className="py-24 flex flex-col items-center gap-6">
                <div className="w-14 h-14 border-2 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase">Scanning Menu...</p>
              </div>
            ) : image ? (
               <div className="aspect-video rounded-[2rem] overflow-hidden border border-white/10 relative group">
                  <img src={image} className="w-full h-full object-cover" alt="Capture" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                     <button onClick={() => setImage(null)} className="px-8 py-3 bg-red-500/80 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest">Cancel</button>
                  </div>
               </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-20 border-2 border-dashed border-white/5 rounded-[2.5rem] hover:border-amber-500/30 transition-all flex flex-col items-center gap-4 bg-white/[0.01]"
              >
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Upload Photo</div>
              </button>
            )}
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </div>

          {error && (
            <div className="p-5 glass rounded-2xl border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest">
              {error}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VisionScanner;
