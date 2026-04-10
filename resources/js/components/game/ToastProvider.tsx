import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle, X, Zap } from 'lucide-react';

type ToastType = 'info' | 'success' | 'error' | 'warning' | 'military';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToasts = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToasts must be used within ToastProvider');
    return context;
};

const ToastItem = ({ toast, onRemove }: { toast: Toast, onRemove: (id: number) => void }) => {
    const typeConfigs = {
        info: { icon: <Info size={18} />, color: 'border-sky-500/50 bg-sky-500/10 text-sky-400' },
        success: { icon: <CheckCircle size={18} />, color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
        error: { icon: <AlertTriangle size={18} />, color: 'border-red-500/50 bg-red-500/10 text-red-400' },
        warning: { icon: <AlertTriangle size={18} />, color: 'border-orange-500/50 bg-orange-500/10 text-orange-400' },
        military: { icon: <Zap size={18} className="animate-pulse" />, color: 'border-neutral-500/50 bg-neutral-900/90 text-white' }
    };

    const config = typeConfigs[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[300px] ${config.color}`}
        >
            <div className="shrink-0">{config.icon}</div>
            <div className="flex-1 text-[11px] font-black uppercase tracking-widest leading-tight">
                {toast.message}
            </div>
            <button 
                onClick={() => onRemove(toast.id)}
                className="shrink-0 text-white/20 hover:text-white transition-colors"
            >
                <X size={14} />
            </button>
        </motion.div>
    );
};
