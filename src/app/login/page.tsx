'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { API_BASE } from '@/config/api';
import axios from 'axios';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
            if (res.data.success) {
                toast('Welcome back!', 'success');
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                router.push('/dashboard');
            }
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Login failed. Please check your credentials.';
            setError(msg);
            toast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 selection:bg-black selection:text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-black tracking-tighter mb-2">AdFlow.</h1>
                    <p className="text-gray-500 font-medium">Welcome back, login to manage your ads.</p>
                </div>

                <Card className="shadow-xl border-0">
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <Input
                                label="Email address"
                                type="email"
                                placeholder="name@company.com"
                                icon={<Mail size={18} />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock size={18} />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {error && <p className="text-xs text-red-500 font-bold text-center mt-2">{error}</p>}
                            <Button type="submit" className="w-full h-11 text-sm font-bold" isLoading={loading}>
                                Sign In
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center border-t border-gray-50 bg-gray-50/30 rounded-b-2xl">
                        <p className="text-sm text-gray-500 font-medium">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-black font-bold hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
