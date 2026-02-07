
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserRole, UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onAuth: (profile: UserProfile) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onAuth }) => {
  const [role, setRole] = useState<UserRole>('CONSUMER');
  const [form, setForm] = useState({ email: '', password: '' });

  const handleJoin = () => {
    if (!form.email || !form.password) return;
    
    // For MVP purposes, any login works, but we nudge them toward the dummy credentials
    const displayName = form.email.split('@')[0];
    const name = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    onAuth({
      name,
      email: form.email,
      role,
      history: [],
      avatar: `https://i.pravatar.cc/150?u=${form.email}`
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#000] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08),transparent_60%)]" />
      </div>

      <motion.div 
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg space-y-10 relative z-10"
      >
        <div className="text-center space-y-3">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 accent-gradient rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.2)] mx-auto mb-8 border border-white/20"
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tighter font-jakarta uppercase">ELITE CAFE</h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">[The best cafeteria in the North]</p>
        </div>

        <div className="glass p-10 rounded-[3rem] border-white/10 shadow-3xl space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none" />
          
          <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5 relative z-10">
            {(['CONSUMER', 'OWNER'] as UserRole[]).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${role === r ? 'bg-white/10 text-amber-500 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'text-white/20 hover:text-white/40'}`}
              >
                {r === 'CONSUMER' ? 'Log In' : 'Admin'}
              </button>
            ))}
          </div>

          <div className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Your email</label>
              <input 
                type="email"
                placeholder={role === 'OWNER' ? "admin@cafe.com" : "guest@cafe.com"}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Your Password</label>
              <input 
                type="password"
                placeholder={role === 'OWNER' ? "admin123" : "123456"}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-amber-500/50 transition-all placeholder:text-white/10"
              />
            </div>
          </div>

          <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-center relative z-10">
            <p className="text-[9px] font-black uppercase tracking-widest text-amber-500/60">
              {role === 'OWNER' 
                ? 'Admin Credentials: admin@cafe.com / admin123' 
                : 'Guest Credentials: guest@cafe.com / 123456'}
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, shadow: "0 0 30px rgba(245,158,11,0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoin}
            disabled={!form.email || !form.password}
            className="w-full py-6 accent-gradient rounded-[2rem] text-black font-black text-xs uppercase tracking-[0.2em] shadow-2xl disabled:opacity-10 transition-all relative z-10"
          >
            Authenticate Access
          </motion.button>
        </div>

        <div className="text-center flex items-center justify-center gap-4 text-white/10">
          <div className="h-px w-12 bg-white/5" />
          <span className="text-[8px] font-black tracking-[0.4em] uppercase">Premium Session Alpha</span>
          <div className="h-px w-12 bg-white/5" />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
