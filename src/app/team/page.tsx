'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Mail, Shield, Trash2, Search, Filter, MoreHorizontal, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardWrapper } from '@/components/layout/DashboardWrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '@/config/api';

export default function TeamPage() {
    const { user } = useAuth();
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAgent, setNewAgent] = useState({ name: '', email: '', password: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [foundUser, setFoundUser] = useState<any>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [addMode, setAddMode] = useState<'create' | 'recruit'>('create');

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/users/agents`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setAgents(res.data.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAgent = async (e: any) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE}/users/agents`, newAgent, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setIsModalOpen(false);
                setNewAgent({ name: '', email: '', password: '' });
                fetchTeam();
            }
        } catch (err: any) {
            alert(err.response?.data?.error || 'Registration failed');
        }
    };

    const handleSearchUser = async () => {
        try {
            setSearchLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/users/search?email=${searchEmail}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setFoundUser(res.data.data);
            }
        } catch (err) {
            alert('Entity not found in global directory');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleRecruitUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE}/users/invite`, { email: foundUser.email }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setIsModalOpen(false);
                setFoundUser(null);
                setSearchEmail('');
                fetchTeam();
                alert('Entity recruited to strategic unit');
            }
        } catch (err) {
            alert('Recruitment failed');
        }
    };

    const filteredAgents = agents.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardWrapper>
            <div className="flex flex-col gap-8 md:gap-12 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <div className="h-1.5 w-8 bg-black rounded-full" />
                             <span className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">Strategic Unit</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter">Team Hub.</h1>
                        <p className="text-gray-400 mt-3 font-medium max-w-md">Orchestrate your field agents and monitor operational access in real-time.</p>
                    </div>
                    
                    {user?.role === 'Owner' && (
                        <Button 
                            onClick={() => setIsModalOpen(true)}
                            className="h-14 px-8 bg-black text-white rounded-2xl hover:scale-105 active:scale-95 transition-luxury shadow-2xl shadow-black/20 text-xs font-black uppercase tracking-widest"
                        >
                            <UserPlus size={18} className="mr-3" />
                            Deploy New Agent
                        </Button>
                    )}
                </div>

                {/* Search and Filters Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex items-center gap-4 bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-black/5 transition-all">
                        <Search size={18} className="text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Find agent by identity or node..." 
                            className="bg-transparent w-full text-sm font-bold focus:outline-none placeholder:text-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content Area - Responsive Switcher */}
                <div className="w-full">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />)}
                        </div>
                    ) : filteredAgents.length === 0 ? (
                        <div className="bg-gray-50 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200">
                            <div className="p-6 bg-white rounded-full shadow-inner mb-6">
                                <User size={40} className="text-gray-200" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-300 tracking-tight">Zero Agents Deployed</h3>
                            <p className="text-sm text-gray-400 mt-2 max-w-xs">Start building your team by deploying your first field agent today.</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile View (Cards) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
                                {filteredAgents.map((agent) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={agent._id} 
                                        className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col justify-between"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-black/20">
                                                {agent.name[0]}
                                            </div>
                                            <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-green-100 italic">
                                                Online
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-black tracking-tight mb-1">{agent.name}</p>
                                            <div className="flex items-center gap-2 text-gray-400 mb-6">
                                                <Mail size={14} />
                                                <span className="text-xs font-bold">{agent.email}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 py-3 px-4 bg-gray-50 rounded-xl mb-6">
                                                <Shield size={14} className="text-black" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Field Investigator</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 bg-gray-50 text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">Details</button>
                                            <button className="p-3 text-red-500 bg-red-50 rounded-xl"><Trash2 size={16} /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Desktop View (Table) */}
                            <div className="hidden lg:block bg-white rounded-[3rem] shadow-2xl border border-gray-50 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-10 py-8 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Identity</th>
                                            <th className="px-10 py-8 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black text-center">Protocol</th>
                                            <th className="px-10 py-8 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black text-center">Status</th>
                                            <th className="px-10 py-8 text-right text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredAgents.map((agent) => (
                                            <tr key={agent._id} className="hover:bg-gray-50/30 transition-all group">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-105 transition-luxury">
                                                            {agent.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-black text-lg tracking-tight mb-0.5">{agent.name}</p>
                                                            <div className="flex items-center gap-2 text-gray-400">
                                                                <Mail size={12} />
                                                                <span className="text-xs font-bold">{agent.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center justify-center">
                                                        <div className="flex items-center gap-2 text-black font-black text-[10px] uppercase tracking-widest px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                                                            <Shield size={12} />
                                                            Tactical Agent
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                     <div className="flex items-center justify-center">
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 italic">
                                                            Active
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="h-10 w-10 flex items-center justify-center text-gray-300 hover:text-black transition-all">
                                                            <MoreHorizontal size={20} />
                                                        </button>
                                                        <button className="h-10 w-10 flex items-center justify-center text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Premium Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[2rem] md:rounded-[3.5rem] shadow-3xl p-6 md:p-12 relative overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16 pointer-events-none" />
                            
                            <h2 className="text-2xl md:text-4xl font-black text-black tracking-tighter mb-2">Deploy Agent.</h2>
                            <p className="text-xs md:text-sm text-gray-400 font-medium mb-6 md:mb-8">Expand your network with top-tier talent.</p>

                            <div className="flex bg-gray-50 p-1.5 rounded-xl md:rounded-2xl mb-6 md:mb-8 overflow-x-auto">
                                <button 
                                    onClick={() => setAddMode('create')}
                                    className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${addMode === 'create' ? 'bg-white shadow-lg text-black' : 'text-gray-400 hover:text-black'}`}
                                >
                                    Create New Account
                                </button>
                                <button 
                                    onClick={() => setAddMode('recruit')}
                                    className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${addMode === 'recruit' ? 'bg-white shadow-lg text-black' : 'text-gray-400 hover:text-black'}`}
                                >
                                    Recruit from Directory
                                </button>
                            </div>
                            
                            {addMode === 'create' ? (
                                <form onSubmit={handleAddAgent} className="space-y-6 relative z-10">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Identity Signature</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white outline-none font-bold transition-all"
                                            placeholder="Full Name"
                                            required
                                            value={newAgent.name}
                                            onChange={e => setNewAgent({...newAgent, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Access Terminal (Email)</label>
                                        <input 
                                            type="email" 
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white outline-none font-bold transition-all"
                                            placeholder="agent@adflow.ai"
                                            required
                                            value={newAgent.email}
                                            onChange={e => setNewAgent({...newAgent, email: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Secure Passkey</label>
                                        <input 
                                            type="password" 
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white outline-none font-bold transition-all"
                                            placeholder="••••••••"
                                            required
                                            value={newAgent.password}
                                            onChange={e => setNewAgent({...newAgent, password: e.target.value})}
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                        <button 
                                            type="button" 
                                            onClick={() => setIsModalOpen(false)} 
                                            className="flex-1 px-8 py-5 rounded-2xl font-black text-xs uppercase text-gray-400 hover:bg-gray-50 transition-all"
                                        >
                                            Abort Mission
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="flex-1 px-8 py-5 bg-black text-white rounded-2xl font-black text-xs uppercase shadow-2xl shadow-black/20 hover:translate-y-[-2px] active:translate-y-[0px] transition-all"
                                        >
                                            Confirm Deployment
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Global Directory Search</label>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input 
                                                type="email" 
                                                className="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white outline-none font-bold transition-all text-sm"
                                                placeholder="Search by registered email..."
                                                value={searchEmail}
                                                onChange={e => setSearchEmail(e.target.value)}
                                            />
                                            <button 
                                                onClick={handleSearchUser}
                                                disabled={searchLoading}
                                                className="h-14 sm:h-auto px-8 bg-black text-white rounded-xl md:rounded-2xl font-black text-xs uppercase hover:bg-gray-800 disabled:opacity-50"
                                            >
                                                Scan
                                            </button>
                                        </div>
                                    </div>

                                    {foundUser && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-6 md:p-8 bg-gray-50 rounded-[2rem] border border-gray-100 text-center"
                                        >
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white mx-auto rounded-full flex items-center justify-center font-black text-xl md:text-2xl shadow-lg border border-gray-50 mb-4">
                                                {foundUser.name[0]}
                                            </div>
                                            <h4 className="text-lg md:text-xl font-black text-black tracking-tight">{foundUser.name}</h4>
                                            <p className="text-[10px] md:text-xs font-bold text-gray-400 mb-6">{foundUser.email}</p>
                                            
                                            <button 
                                                onClick={handleRecruitUser}
                                                className="w-full h-12 md:h-14 bg-black text-white rounded-xl md:rounded-2xl font-black text-xs uppercase shadow-2xl shadow-black/10 hover:scale-105 transition-all"
                                            >
                                                Recruit Agent
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardWrapper>
    );
}
