
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface AiAssistantProps {
  products: Product[];
  onAdd: (product: Product, delta: number) => void;
}

interface Recommendation {
  name: string;
  reason: string;
  sku: string;
  theme: string;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ products, onAdd }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const activeProducts = products.filter(p => p.active);
      const inventoryString = activeProducts.map(p => `${p.sku}: ${p.name}`).join(', ');

      const prompt = `System: High-End Cafeteria AI Sommelier.
      Objective: Recommend 3 diverse items from this inventory: ${inventoryString}.
      Themes: 1. "The Classic" (essential choice), 2. "The Refined" (sophisticated pairing), 3. "The Bold" (adventurous taste).
      Response: Valid JSON array of 3 objects with keys: "name", "reason" (short poetic endorsement), "sku", and "theme".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING },
                sku: { type: Type.STRING },
                theme: { type: Type.STRING }
              },
              required: ["name", "reason", "sku", "theme"]
            }
          }
        }
      });

      const resText = response.text?.trim() || '[]';
      const data = JSON.parse(resText);
      setRecommendations(data);
      setCurrentIndex(0);
    } catch (e) {
      console.error("Sommelier Error", e);
    } finally {
      setLoading(false);
    }
  };

  const currentRec = recommendations[currentIndex];
  const product = currentRec ? products.find(p => p.sku === currentRec.sku) : null;

  return (
    <div className="glass rounded-[2rem] p-8 border-white/10 relative overflow-hidden group shadow-xl min-h-[340px] flex flex-col justify-between">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-amber-500/[0.05] opacity-60 pointer-events-none" />
      
      <div className="relative space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">AI Sommelier</h4>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {recommendations.length === 0 ? (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-4">
              <p className="text-[11px] text-white/30 font-semibold uppercase tracking-wide leading-relaxed">
                Allow our AI to tailor a curated experience for your unique palate.
              </p>
              <button 
                onClick={getRecommendations}
                disabled={loading}
                className="w-full py-4 glass border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl disabled:opacity-20 hover:bg-amber-500/5 transition-colors"
              >
                {loading ? 'Consulting...' : 'Initiate Consult'}
              </button>
            </motion.div>
          ) : (
            <motion.div key={currentIndex} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6 pt-2">
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500/80">{currentRec.theme}</span>
                <div className="text-xl font-black text-white leading-tight">{currentRec.name}</div>
                <p className="text-[11px] text-white/40 italic font-medium leading-relaxed">"{currentRec.reason}"</p>
              </div>
              
              <div className="space-y-3">
                {product && (
                  <button 
                    onClick={() => onAdd(product, 1)}
                    className="w-full py-4 bg-white/5 border border-white/5 hover:bg-white/10 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 shadow-xl"
                  >
                    Select Item — ${product.price.toFixed(2)}
                  </button>
                )}
                
                <div className="flex items-center justify-between gap-4 pt-2">
                   <button 
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length)}
                    className="text-[9px] text-white/20 font-black uppercase hover:text-white transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1.5">
                    {recommendations.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all ${i === currentIndex ? 'w-4 bg-amber-500' : 'w-1 bg-white/10'}`} />
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % recommendations.length)}
                    className="text-[9px] text-white/20 font-black uppercase hover:text-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {recommendations.length > 0 && (
        <button 
          onClick={() => setRecommendations([])}
          className="mt-6 text-[8px] text-white/10 font-black uppercase tracking-[0.4em] hover:text-white transition-colors text-center w-full"
        >
          New Consultation
        </button>
      )}
    </div>
  );
};

export default AiAssistant;
