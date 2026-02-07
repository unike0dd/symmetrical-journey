
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { AdminSettings, Product, Category } from '../types';

interface AdminDashboardProps {
  settings: AdminSettings;
  products: Product[];
  onSaveSettings: (s: AdminSettings) => void;
  onSaveProducts: (p: Product[]) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ settings, products, onSaveSettings, onSaveProducts, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [localProducts, setLocalProducts] = useState(products);
  const [history, setHistory] = useState<{settings: AdminSettings, products: Product[]} | null>(null);
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'PRODUCTS' | 'CATEGORIES'>('SETTINGS');
  const [isLocked, setIsLocked] = useState(settings.isLocked);
  const [generatingSku, setGeneratingSku] = useState<string | null>(null);

  const snapshot = () => {
    if (!history) {
      setHistory({ 
        settings: JSON.parse(JSON.stringify(localSettings)), 
        products: JSON.parse(JSON.stringify(localProducts)) 
      });
    }
  };

  const handleUndo = () => {
    if (history) {
      setLocalSettings(history.settings);
      setLocalProducts(history.products);
      setHistory(null);
    }
  };

  const handleUpdateProduct = (sku: string, updates: Partial<Product>) => {
    if (isLocked) return;
    snapshot();
    const updated = localProducts.map(p => p.sku === sku ? { ...p, ...updates } : p);
    setLocalProducts(updated);
  };

  const handleGenerateImage = async (product: Product) => {
    if (isLocked) return;
    setGeneratingSku(product.sku);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A professional high-end gourmet food photography of ${product.name}, described as ${product.description || 'delicious'}. Soft natural lighting, dark stone luxury background, 8k cinematic masterpiece.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          handleUpdateProduct(product.sku, { image_url: imageUrl });
          break;
        }
      }
    } catch (e) {
      console.error("Image Generation Failed", e);
    } finally {
      setGeneratingSku(null);
    }
  };

  const toggleLock = () => {
    if (!isLocked) {
      onSaveSettings({ ...localSettings, isLocked: true });
      onSaveProducts(localProducts);
      setHistory(null);
    }
    setIsLocked(!isLocked);
  };

  const handleAddCategory = () => {
    if (isLocked) return;
    const name = prompt("Enter new category name:");
    if (name && name.trim()) {
      snapshot();
      const newCat = name.trim().toUpperCase();
      if (!localSettings.categories.includes(newCat)) {
        setLocalSettings(prev => ({ ...prev, categories: [...prev.categories, newCat] }));
      }
    }
  };

  const handleEditCategory = (oldCat: string) => {
    if (isLocked) return;
    const newName = prompt(`Rename category "${oldCat}" to:`, oldCat);
    if (newName && newName.trim() && newName.trim().toUpperCase() !== oldCat) {
      snapshot();
      const newCat = newName.trim().toUpperCase();
      
      // Update categories list
      const updatedCats = localSettings.categories.map(c => c === oldCat ? newCat : c);
      setLocalSettings(prev => ({ ...prev, categories: updatedCats }));

      // Update products using this category
      const updatedProducts = localProducts.map(p => 
        p.category === oldCat ? { ...p, category: newCat } : p
      );
      setLocalProducts(updatedProducts);
    }
  };

  const handleRemoveCategory = (cat: string) => {
    if (isLocked) return;
    
    // Check if category is in use
    const isUsed = localProducts.some(p => p.category === cat);
    if (isUsed) {
      alert(`Cannot delete "${cat}". It is currently assigned to one or more products.`);
      return;
    }

    if (confirm(`Confirm deletion of category "${cat}"?`)) {
      snapshot();
      setLocalSettings(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }));
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-5xl glass rounded-[3rem] border-white/10 shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-8">
            <h2 className="text-2xl font-black text-white tracking-tighter font-jakarta">Elite Command</h2>
            <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/5">
              {['SETTINGS', 'PRODUCTS', 'CATEGORIES'].map((t: any) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white/10 text-teal-400 shadow-xl' : 'text-white/30 hover:text-white/60'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {history && !isLocked && (
              <button 
                onClick={handleUndo}
                className="px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all bg-white/5 border border-white/5"
              >
                Undo Changes
              </button>
            )}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLock}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isLocked ? 'bg-white/5 text-white/30 hover:text-white/60 border border-white/10' : 'bg-teal-500 text-black shadow-2xl shadow-teal-500/20'}`}
            >
              {isLocked ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  System Locked
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                  Authorize Changes
                </>
              )}
            </motion.button>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
          {activeTab === 'SETTINGS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-teal-500 rounded-full shadow-[0_0_8px_rgba(20,184,166,1)]" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Fiscal Configuration</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Taxation Protocol (VAT / IVA)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      disabled={isLocked}
                      value={localSettings.vatRate}
                      onChange={e => { snapshot(); setLocalSettings({...localSettings, vatRate: parseFloat(e.target.value)}); }}
                      className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-teal-500/50 transition-all ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Logistics Overhead (Delivery)</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 text-sm font-bold">$</span>
                      <input 
                        type="number" 
                        disabled={isLocked}
                        value={localSettings.deliveryFee}
                        onChange={e => { snapshot(); setLocalSettings({...localSettings, deliveryFee: parseFloat(e.target.value)}); }}
                        className={`w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-6 py-4 text-sm font-bold outline-none focus:border-teal-500/50 transition-all ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,1)]" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Security Correspondence</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">System Administrator Email</label>
                    <input 
                      type="email" 
                      disabled={isLocked}
                      value={localSettings.ownerEmail}
                      onChange={e => { snapshot(); setLocalSettings({...localSettings, ownerEmail: e.target.value}); }}
                      className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-teal-500/50 transition-all ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CATEGORIES' && (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Product Categories</h3>
                </div>
                {!isLocked && (
                  <button 
                    onClick={handleAddCategory}
                    className="text-[10px] font-black text-teal-400 uppercase tracking-widest px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 transition-all"
                  >
                    + Define Category
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {localSettings.categories.map(cat => {
                  const isUsed = localProducts.some(p => p.category === cat);
                  return (
                    <div key={cat} className="glass p-4 rounded-2xl flex items-center justify-between border-white/5 group relative overflow-hidden">
                      <span className={`text-xs font-bold ${isUsed ? 'text-white' : 'text-white/70'}`}>{cat}</span>
                      {!isLocked && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => handleEditCategory(cat)}
                            title="Rename Category"
                            className="p-1 hover:text-amber-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button 
                            onClick={() => handleRemoveCategory(cat)}
                            title={isUsed ? "Cannot delete category in use" : "Delete Category"}
                            className={`p-1 transition-all ${isUsed ? 'text-white/10 cursor-not-allowed' : 'hover:text-red-400 text-white/40'}`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'PRODUCTS' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Marketplace Inventory</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {localProducts.map(p => (
                  <div key={p.sku} className="glass p-6 rounded-[2.5rem] border-white/5 flex flex-col gap-6 group relative">
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover:scale-105 transition-transform">
                          <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} />
                        </div>
                        {!isLocked && (
                          <button 
                            disabled={generatingSku === p.sku}
                            onClick={() => handleGenerateImage(p)}
                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full accent-gradient text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                          >
                            {generatingSku === p.sku ? (
                              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            )}
                          </button>
                        )}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-2">
                          <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Asset Label</div>
                          <input 
                            disabled={isLocked}
                            value={p.name}
                            onChange={e => handleUpdateProduct(p.sku, { name: e.target.value })}
                            className={`bg-transparent text-lg font-bold text-white outline-none w-full ${isLocked ? 'opacity-50' : ''}`}
                          />
                          <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar py-1">
                            {localSettings.categories.map(cat => (
                              <button
                                key={cat}
                                disabled={isLocked}
                                onClick={() => handleUpdateProduct(p.sku, { category: cat })}
                                className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${p.category === cat ? 'bg-teal-500 text-black' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Valuation ($)</div>
                          <input 
                            disabled={isLocked}
                            type="number"
                            value={p.price}
                            onChange={e => handleUpdateProduct(p.sku, { price: parseFloat(e.target.value) || 0 })}
                            className={`bg-transparent text-lg font-bold text-teal-400 outline-none w-full ${isLocked ? 'opacity-50' : ''}`}
                          />
                        </div>
                        <div className="flex items-center justify-end">
                          <button 
                            disabled={isLocked}
                            onClick={() => handleUpdateProduct(p.sku, { active: !p.active })}
                            className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${p.active ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'} ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            {p.active ? 'Active Status' : 'Archived'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Elite Description</label>
                      </div>
                      <textarea 
                        disabled={isLocked}
                        value={p.description || ''}
                        onChange={e => handleUpdateProduct(p.sku, { description: e.target.value })}
                        rows={3}
                        placeholder="Define the sensorial journey of this selection..."
                        className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-medium text-white/70 outline-none focus:border-teal-500/50 transition-all resize-none ${isLocked ? 'opacity-40' : ''}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
