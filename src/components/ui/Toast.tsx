'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
    id: number;
    text: string;
    type: ToastType;
}

let toastCount = 0;
let observers: ((message: ToastMessage) => void)[] = [];

export const toast = (text: string, type: ToastType = 'info') => {
    const newMessage = { id: ++toastCount, text, type };
    observers.forEach(callback => callback(newMessage));
};

export function ToastContainer() {
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const callback = (message: ToastMessage) => {
            setMessages(prev => [...prev, message]);
            setTimeout(() => {
                setMessages(prev => prev.filter(m => m.id !== message.id));
            }, 5000);
        };
        observers.push(callback);
        return () => {
            observers = observers.filter(c => c !== callback);
        };
    }, []);

    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
            <AnimatePresence>
                {messages.map((m) => (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className={`min-w-[280px] p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border backdrop-blur-md ${
                            m.type === 'success' ? 'bg-white/90 border-green-100 text-green-800' :
                            m.type === 'error' ? 'bg-white/90 border-red-100 text-red-800' :
                            'bg-white/90 border-gray-100 text-gray-800'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {m.type === 'success' && <CheckCircle2 className="text-green-500" size={20} />}
                            {m.type === 'error' && <XCircle className="text-red-500" size={20} />}
                            {m.type === 'info' && <Info className="text-blue-500" size={20} />}
                            <span className="text-sm font-black tracking-tight">{m.text}</span>
                        </div>
                        <button 
                            onClick={() => setMessages(prev => prev.filter(msg => msg.id !== m.id))}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            <X size={14} className="text-gray-400" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
