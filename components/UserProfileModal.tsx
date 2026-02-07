
import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile, Order } from '../types';

interface UserProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onReorder: (order: Order) => void;
  onLogout: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onReorder, onLogout }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-2xl glass rounded-[3rem] border-white/10 shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-10 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img src={user.avatar} alt="User Avatar" className="w-20 h-20 rounded-3xl object-cover border-2 border-amber-500/20 group-hover:border-amber-500 transition-all duration-500" />
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full -z-10 group-hover:bg-amber-500/40 transition-all" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">{user.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{user.email}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">{user.role}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={onLogout} className="px-5 py-3 rounded-2xl glass text-[10px] font-black text-red-400 uppercase tracking-widest hover:bg-red-500/10 transition-all">Sign Out</button>
             <button onClick={onClose} className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gradient font-jakarta">Engagement History</h3>
              <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">{user.history.length} Previous Sessions</span>
            </div>

            {user.history.length === 0 ? (
              <div className="text-center py-24 glass rounded-[2.5rem] border-dashed border-white/10">
                <p className="text-white/20 font-medium italic font-jakarta">No historical data available for this profile.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {user.history.map((order) => (
                  <motion.div 
                    layout
                    key={order.id} 
                    className="glass p-6 rounded-[2rem] border-white/5 space-y-5 hover:border-white/20 transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[11px] font-black text-amber-500 mb-1 tracking-wider uppercase">{order.id}</div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-tight">
                          {new Date(order.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="text-xl font-black text-white tracking-tighter">${order.total.toFixed(2)}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {order.items.map((it, idx) => (
                        <span key={idx} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold text-white/60 border border-white/5">
                          {it.qty}x {it.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-end pt-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onReorder(order)}
                        className="px-8 py-3 glass border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all rounded-2xl"
                      >
                        Restore Selection
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfileModal;
