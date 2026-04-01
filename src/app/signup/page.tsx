'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Shield, ArrowRight } from 'lucide-react';
import { API_BASE } from '@/config/api';
import axios from 'axios';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Owner');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password, role });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                router.push('/onboarding');
            }

        } catch (err: any) {
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
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
                    <p className="text-gray-500 font-medium">Create your account to start managing your ads.</p>
                </div>

                <Card className="shadow-xl border-0">
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>Join AdFlow and take control of your lead generation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignup} className="space-y-5">
                            <div className="relative">
                                <User className="absolute left-3.5 top-[38px] -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
                                    className="pl-10"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-[38px] -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <Input
                                    label="Email address"
                                    type="email"
                                    placeholder="name@company.com"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-[38px] -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Shield className="absolute left-3.5 top-[38px] -translate-y-1/2 text-gray-400 z-10" size={18} />
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700 ml-1">Account Role</label>
                                    <select
                                        className="flex h-11 w-full rounded-2xl border border-gray-200 bg-white pl-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all shadow-sm hover:border-gray-300"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="Owner">Owner</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Agent">Agent</option>
                                    </select>
                                </div>
                            </div>
                            {error && <p className="text-xs text-red-500 font-bold text-center mt-2">{error}</p>}
                            <Button type="submit" className="w-full h-11 text-sm font-bold" isLoading={loading}>
                                Create Account
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center border-t border-gray-50 bg-gray-50/30 rounded-b-2xl">
                        <p className="text-sm text-gray-500 font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="text-black font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
