'use client';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'blue' | 'yellow' | 'green' | 'gray' | 'red' | 'indigo';
    className?: string;
}

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
    const variants = {
        blue: 'bg-blue-50 text-blue-700 ring-blue-100',
        yellow: 'bg-amber-50 text-amber-700 ring-amber-100',
        green: 'bg-green-50 text-green-700 ring-green-100',
        red: 'bg-red-50 text-red-700 ring-red-100',
        indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
        gray: 'bg-gray-50 text-gray-400 ring-gray-100'
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ring-1 inline-flex items-center justify-center ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}

export function getStatusVariant(status: string): 'blue' | 'yellow' | 'green' | 'gray' {
    switch (status) {
        case 'New': return 'blue';
        case 'Contacted': return 'yellow';
        case 'Converted': return 'green';
        default: return 'gray';
    }
}

export function getScoreBadge(score: number) {
    if (score >= 75) return { label: '🔥 Hot', variant: 'red' as const };
    if (score >= 40) return { label: '⚡ Warm', variant: 'yellow' as const };
    return { label: '❄️ Cold', variant: 'blue' as const };
}
