
import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../types';

interface HeaderProps {
  cartCount: number;
  user: UserProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onOpenScanner: () => void;
  onOpenAdmin: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, user, theme, onToggleTheme, onOpenCart, onOpenProfile, onOpenScanner, onOpenAdmin }) => {
  if (!user) return null;

  const firstName = user.name ? user.name.split(' ')[0] : 'Guest';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gradient hidden sm:block font-jakarta">ELITE CAFE</span>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            className="glass hover:bg-white/10 px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-semibold tracking-wide"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
          </motion.button>
          {user.role === 'OWNER' && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAdmin}
              className="glass hover:bg-white/10 p-2.5 rounded-xl transition-all flex items-center gap-2 group border border-teal-500/20"
            >
              <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </motion.button>
          )}

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenScanner}
            title="Scan Receipt/Menu"
            className="glass hover:bg-white/10 p-2.5 rounded-xl transition-all flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 text-white/80 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenCart}
            className="relative glass hover:bg-white/10 p-2.5 rounded-xl transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="flex items-center justify-center h-5 px-1.5 text-[10px] font-bold bg-amber-500 text-black rounded-full min-w-[20px]">
                {cartCount}
              </span>
            )}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenProfile}
            className="flex items-center gap-2 glass pl-2 pr-4 py-1.5 rounded-xl hover:bg-white/10 transition-all"
          >
            <img src={user.avatar || `https://i.pravatar.cc/150?u=${user.email}`} alt="Avatar" className="w-7 h-7 rounded-lg object-cover border border-white/10" />
            <span className="text-xs font-bold text-white/80 hidden md:block">{firstName}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
