import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const notify = useCallback((title, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, title: title.toUpperCase(), type, isExiting: false }]);
    
    setTimeout(() => {
      setNotifications((prev) => 
        prev.map(n => n.id === id ? { ...n, isExiting: true } : n)
      );
    }, 3000);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3500);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      <div className="fixed top-6 right-6 z-99999 flex flex-col gap-3 w-80 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`
              relative p-5 rounded-xl border backdrop-blur-xl shadow-2xl 
              transition-all duration-500 ease-in-out
              ${n.isExiting 
                ? 'opacity-0 translate-x-10 scale-95' 
                : 'opacity-100 translate-x-0 scale-100 animate-in fade-in slide-in-from-right-10'}
              
              /* ADAPTIVE COLORS */
              bg-background/80 text-foreground border-border/50
              ${n.type === 'success' 
                ? 'dark:border-emerald-500/30 border-emerald-500/20 shadow-emerald-500/10' 
                : 'dark:border-red-500/30 border-red-500/20 shadow-red-500/10'}
            `}
          >
            {/* Background Adaptive Glow */}
            <div className={`absolute inset-0 opacity-[0.03] dark:opacity-[0.07] rounded-xl ${n.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />

            <div className="relative flex items-center gap-4">
              {/* Boutique Vertical Indicator */}
              <div className={`w-1 h-8 rounded-full ${n.type === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
              
              <div className="flex flex-col">
                <span className="font-black italic text-[10px] tracking-[0.25em] text-muted-foreground mb-1 uppercase opacity-60">
                  System Alert
                </span>
                <span className="font-bold text-sm tracking-tighter uppercase">
                  {n.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotify = () => useContext(NotificationContext);