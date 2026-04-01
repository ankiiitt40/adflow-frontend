'use client';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-black text-white hover:bg-gray-800 shadow-md transform hover:-translate-y-0.5 transition-all',
            secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm border border-gray-200',
            outline: 'border border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50',
            ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
            danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md transform hover:-translate-y-0.5 transition-all',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base font-semibold',
            icon: 'p-2',
        };

        return (
            <motion.button
                whileTap={{ scale: 0.98 }}
                ref={ref as any}
                className={cn(
                    'inline-flex items-center justify-center rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading}
                {...(props as any)}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
