'use client';
import { Button } from '@/components/ui/Button';
import { LucideIcon, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
    title: string;
    description: string;
    icon: LucideIcon;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ title, description, icon: Icon, actionLabel, onAction }: EmptyStateProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-20 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100"
        >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 text-gray-300">
                <Icon size={32} />
            </div>
            <h3 className="text-2xl font-black text-black tracking-tight mb-2">{title}</h3>
            <p className="text-gray-500 font-medium max-w-sm mb-8 leading-relaxed">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button onClick={onAction} className="h-11 px-8 rounded-2xl shadow-lg shadow-black/5 bg-black text-white hover:scale-105 active:scale-95 transition-luxury">
                    <Plus size={18} className="mr-2" />
                    {actionLabel}
                </Button>
            )}
        </motion.div>
    );
}
