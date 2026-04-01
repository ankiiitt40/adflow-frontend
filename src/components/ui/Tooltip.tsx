'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export function Tooltip({ text, children }: { text: string, children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div 
            className="group relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-xl z-50 flex items-center gap-2 pointer-events-none"
                    >
                        <HelpCircle size={10} className="text-gray-400" />
                        {text}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
