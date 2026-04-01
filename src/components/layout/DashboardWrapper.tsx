'use client';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-white min-h-screen relative overflow-x-hidden">
            <Sidebar />
            <main className="flex-1 min-h-screen relative p-6 md:p-12 overflow-y-auto">
                {/* Background Decorator */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gray-50/50 rounded-full blur-[120px] pointer-events-none -z-10" />
                
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    className="max-w-7xl mx-auto"
                >
                    {children}
                </motion.div>
                
                {/* Footer Decorator */}
                <div className="mt-20 border-t border-gray-50 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-40">
                    <p>© 2026 AdFlow SaaS Ecosystem</p>
                    <div className="flex gap-6">
                        <span className="hover:text-black cursor-pointer transition-colors">Privacy</span>
                        <span className="hover:text-black cursor-pointer transition-colors">Security</span>
                        <span className="hover:text-black cursor-pointer transition-colors">Cloud Status</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
