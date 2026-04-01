'use client';
import { motion } from 'framer-motion';

export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`relative overflow-hidden bg-gray-100 rounded-lg ${className}`}>
            <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/3"
            />
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="space-y-2">
                    <Skeleton className="w-24 h-3" />
                    <Skeleton className="w-12 h-2" />
                </div>
            </div>
            <Skeleton className="w-full h-8 rounded-xl" />
        </div>
    );
}

export function TableRowSkeleton() {
    return (
        <div className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-2xl" />
                <div className="space-y-2">
                    <Skeleton className="w-32 h-3" />
                    <Skeleton className="w-24 h-2" />
                </div>
            </div>
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-16 h-4" />
        </div>
    );
}
