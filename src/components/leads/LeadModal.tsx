'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Globe, Plus, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { toast } from '@/components/ui/Toast';
import { API_BASE } from '@/config/api';

interface LeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function LeadModal({ isOpen, onClose, onSuccess }: LeadModalProps) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        source: 'Manual'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE}/leads`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast('Lead created successfully!', 'success');
                setForm({ name: '', phone: '', source: 'Manual' });
                onSuccess?.();
                onClose();
            }
        } catch (err: any) {
            toast(err.response?.data?.message || 'Error creating lead', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden shadow-black/20"
                    >
                        <div className="p-8 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-black text-white rounded-xl shadow-lg">
                                    <Plus size={18} />
                                </div>
                                <h3 className="text-2xl font-black text-black tracking-tight">Add New Lead</h3>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-luxury">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-5">
                                <div className="relative">
                                    <User className="absolute left-3.5 top-[38px] -translate-y-1/2 text-gray-400 z-10" size={18} />
                                    <Input 
                                        label="Full Name" 
                                        placeholder="John Doe" 
                                        className="pl-10"
                                        value={form.name} 
                                        onChange={(e) => setForm({...form, name: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-[38px] -translate-y-1/2 text-gray-400 z-10" size={18} />
                                    <Input 
                                        label="Phone Number" 
                                        placeholder="+1 234 567 890" 
                                        className="pl-10"
                                        value={form.phone} 
                                        onChange={(e) => setForm({...form, phone: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="relative">
                                    <Globe className="absolute left-3.5 top-[38px] -translate-y-1/2 text-gray-400 z-10" size={18} />
                                    <Input 
                                        label="Lead Source" 
                                        placeholder="e.g. Referral, Website" 
                                        className="pl-10"
                                        value={form.source} 
                                        onChange={(e) => setForm({...form, source: e.target.value})} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Button 
                                    type="button"
                                    variant="outline" 
                                    className="flex-1 h-12 rounded-2xl font-black bg-white" 
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    className="flex-1 h-12 rounded-2xl font-black bg-black text-white shadow-xl hover:scale-105 active:scale-95 transition-luxury"
                                    isLoading={loading}
                                >
                                    Create Lead
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
