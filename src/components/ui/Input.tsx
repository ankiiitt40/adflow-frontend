import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, type, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 transition-colors group-focus-within:text-black">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            'flex h-12 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:border-gray-300',
                            icon ? 'pl-11' : '',
                            error ? 'border-red-500 focus:ring-red-500' : '',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 text-xs text-red-500 ml-1 font-bold">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
