
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, CartItem, Order, UserProfile, AdminSettings } from './types';
import { DEMO_PRODUCTS, DEFAULT_ADMIN_SETTINGS } from './constants';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import ProductGrid from './components/ProductGrid';
import InvoiceView from './components/InvoiceView';
import CartModal from './components/CartModal';
import AiAssistant from './components/AiAssistant';
import UserProfileModal from './components/UserProfileModal';
import VisionScanner from './components/VisionScanner';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const initApp = () => {
      const savedProducts = localStorage.getItem('elite_products');
      setProducts(savedProducts ? JSON.parse(savedProducts) : DEMO_PRODUCTS);

      const savedSettings = localStorage.getItem('elite_settings');
      if (savedSettings) setAdminSettings(JSON.parse(savedSettings));

      const savedUser = localStorage.getItem('elite_active_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setIsAuthOpen(true);
      }
      setIsInitialLoading(false);
    };

    const timer = setTimeout(initApp, 600);
    return () => clearTimeout(timer);
  }, []);

  const saveProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('elite_products', JSON.stringify(newProducts));
  }, []);

  const saveSettings = useCallback((newSettings: AdminSettings) => {
    setAdminSettings(newSettings);
    localStorage.setItem('elite_settings', JSON.stringify(newSettings));
  }, []);

  const updateDeliveryFee = useCallback((fee: number) => {
    setAdminSettings(prev => ({ ...prev, deliveryFee: fee }));
  }, []);

  const combos = useMemo(() => products.filter(p => p.category === 'COMBO' && p.active), [products]);
  const otherProducts = useMemo(() => products.filter(p => p.category !== 'COMBO' && p.active), [products]);

  const updateCart = useCallback((product: { sku: string; name: string; price: number }, delta: number) => {
    setCart(prev => {
      const next = new Map<string, CartItem>(prev);
      const existing = next.get(product.sku);
      const newQty = Math.max(0, (existing?.qty || 0) + delta);
      
      if (newQty === 0) {
        next.delete(product.sku);
      } else {
        next.set(product.sku, {
          sku: product.sku,
          name: product.name,
          price: product.price,
          qty: newQty
        });
      }
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setCart(new Map()), []);

  const addOrderToHistory = useCallback((items: CartItem[], total: number) => {
    if (!user) return;
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toISOString(),
      items: [...items],
      total,
      status: 'completed'
    };
    const updatedUser: UserProfile = { ...user, history: [newOrder, ...user.history] };
    setUser(updatedUser);
    localStorage.setItem('elite_active_user', JSON.stringify(updatedUser));
  }, [user]);

  const cartArray = useMemo(() => Array.from(cart.values()), [cart]);

  const totals = useMemo(() => {
    const subtotal = cartArray.reduce((acc, it) => acc + (it.price * it.qty), 0);
    const vat = subtotal * adminSettings.vatRate;
    const total = subtotal + vat + adminSettings.deliveryFee;
    return { subtotal, vat, total };
  }, [cartArray, adminSettings]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-t-2 border-amber-500 rounded-full blur-[1px]"
          />
          <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black tracking-[0.4em] uppercase text-amber-500/60 animate-pulse">[The best cafeteria in the North]</p>
          <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest">Premium Service — Authenticating</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-32 relative selection:bg-amber-500/30 overflow-x-hidden ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-black text-white'}`}>
      <div className={`fixed inset-0 pointer-events-none overflow-hidden -z-10 ${theme === 'light' ? 'bg-[#f8f5f2]' : 'bg-[#020202]'}`}>
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-[15%] -left-[10%] w-[60%] h-[60%] blur-[180px] rounded-full ${theme === 'light' ? 'bg-amber-300/40' : 'bg-amber-600/20'}`}
        />
        <motion.div 
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -bottom-[10%] -right-[15%] w-[65%] h-[65%] blur-[180px] rounded-full ${theme === 'light' ? 'bg-teal-200/40' : 'bg-teal-600/20'}`}
        />
      </div>

      <AnimatePresence>
        {!user && isAuthOpen && (
          <AuthModal 
            isOpen={isAuthOpen} 
            onAuth={(profile) => {
              setUser(profile);
              localStorage.setItem('elite_active_user', JSON.stringify(profile));
              setIsAuthOpen(false);
            }} 
          />
        )}
      </AnimatePresence>

      {user && (
        <>
          <Header 
            cartCount={cartArray.length} 
            user={user}
            theme={theme}
            onToggleTheme={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
            onOpenCart={() => setIsCartOpen(true)} 
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          <main className="max-w-7xl mx-auto px-6 pt-28 space-y-16">
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col mb-10">
                <h2 className="text-4xl font-black text-gradient mb-3 tracking-tighter">Chef's Masterpieces</h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">[The best cafeteria in the North]</p>
              </div>
              <HeroCarousel 
                combos={combos} 
                onUpdate={updateCart} 
                cartItems={cart}
              />
            </motion.section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <section className="lg:col-span-8 space-y-12">
                <ProductGrid 
                  products={otherProducts} 
                  categories={adminSettings.categories}
                  onUpdate={updateCart} 
                  cartItems={cart}
                />
              </section>

              <aside className="lg:col-span-4 sticky top-28 self-start space-y-8">
                <InvoiceView 
                  items={cartArray}
                  totals={totals}
                  deliveryFee={adminSettings.deliveryFee}
                  vatRate={adminSettings.vatRate}
                  onClear={clearCart}
                  onCheckout={() => setIsCartOpen(true)}
                  onUpdateDeliveryFee={updateDeliveryFee}
                />
                <AiAssistant products={products} onAdd={updateCart} />
              </aside>
            </div>
          </main>
        </>
      )}

      <AnimatePresence>
        {isCartOpen && (
          <CartModal 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartArray}
            totals={totals}
            deliveryFee={adminSettings.deliveryFee}
            onUpdate={updateCart}
            onClear={clearCart}
            onOrderPlaced={addOrderToHistory}
            products={products}
          />
        )}
        {isProfileOpen && user && (
          <UserProfileModal 
            user={user}
            onClose={() => setIsProfileOpen(false)}
            onLogout={() => {
              localStorage.removeItem('elite_active_user');
              setUser(null);
              setIsProfileOpen(false);
              setIsAuthOpen(true);
            }}
            onReorder={(order) => {
              clearCart();
              order.items.forEach(it => updateCart(it, it.qty));
              setIsProfileOpen(false);
              setIsCartOpen(true);
            }}
          />
        )}
        {isAdminOpen && user?.role === 'OWNER' && (
          <AdminDashboard 
            settings={adminSettings}
            products={products}
            onSaveSettings={saveSettings}
            onSaveProducts={saveProducts}
            onClose={() => setIsAdminOpen(false)}
          />
        )}
        {isScannerOpen && (
          <VisionScanner 
            onClose={() => setIsScannerOpen(false)}
            availableProducts={products}
            onAddItems={(foundItems) => {
              foundItems.forEach(it => {
                const match = products.find(p => p.sku === it.sku);
                if (match) updateCart(match, it.qty);
              });
              setIsScannerOpen(false);
              setIsCartOpen(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
