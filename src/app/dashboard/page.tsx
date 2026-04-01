'use client';
import { useState, useEffect } from 'react';
import { DashboardWrapper } from '@/components/layout/DashboardWrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Target, 
  Plus,
  RefreshCcw,
  Clock,
  Sparkles,
  Zap,
  ChartBar,
  ChartLine,
  Filter,
  ArrowDown
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { LeadModal } from '@/components/leads/LeadModal';
import { Skeleton } from '@/components/ui/Skeleton';
import { API_URL, API_BASE } from '@/config/api';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell,
    PieChart, Pie
} from 'recharts';
import { io } from 'socket.io-client';

export default function DashboardPage() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

    useEffect(() => {
        fetchDashboardData();

        // --- REAL-TIME SYNC ---
        const socket = io(API_URL);
        socket.on('REFRESH_DATA', (data) => {
            console.log('📡 [LIVE] Auto-Refreshing Dashboard Data!');
            fetchDashboardData();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [analyticsRes, activitiesRes] = await Promise.all([
                axios.get(`${API_BASE}/analytics`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE}/activities`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            
            if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
            if (activitiesRes.data.success) setActivities(activitiesRes.data.data);
        } catch (err) {
            console.error('Error fetching dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardWrapper>
            <div className="flex flex-col gap-6 md:gap-10 p-2 md:p-0">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter mb-2">Workspace.</h1>
                        <p className="text-gray-500 font-medium tracking-tight text-sm md:text-base">Strategic intelligence for {user?.role}.</p>
                    </div>
                    <Button onClick={() => setIsLeadModalOpen(true)} className="h-12 md:h-14 px-8 bg-indigo-600 text-white shadow-2xl shadow-indigo-200 hover:scale-105 active:scale-95 transition-luxury rounded-2xl w-full lg:w-auto text-sm font-bold">
                        <Plus size={18} className="mr-2" />
                        New Campaign Lead
                    </Button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { label: 'Total Reach', value: analytics?.stats?.total || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Conversion Rate', value: `${analytics?.stats?.conversionRate || 0}%`, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Agent Load', value: analytics?.stats?.assigned || 0, icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Hot Trigger', value: analytics?.stats?.contacted || 0, icon: Zap, color: 'text-rose-600', bg: 'bg-rose-50' },
                    ].map((stat, i) => (
                        <Card key={i} className="border-0 shadow-lg rounded-3xl p-6 hover:translate-y-[-4px] transition-all duration-300 group bg-white">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl group-hover:scale-110 transition-luxury shadow-inner`}>
                                    <stat.icon size={20} />
                                </div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">{stat.label}</p>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tighter">{stat.value}</h2>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 flex flex-col gap-8">
                        {/* Area Chart */}
                        <Card className="border-0 shadow-xl rounded-[2.5rem] overflow-hidden bg-white border border-gray-100">
                            <CardHeader className="p-6 md:p-8 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                        <ChartLine size={18} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-black tracking-tighter">Capture Momentum</h3>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 md:p-8 pt-0">
                                <div className="h-72 sm:h-80 w-full min-h-[280px]">
                                    {loading || !analytics ? <Skeleton className="w-full h-full rounded-2xl" /> : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={analytics?.dayData || []}>
                                                <defs>
                                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                                                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 'bold' }} />
                                                <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorLeads)" dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 4 }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Bar Chart */}
                            <Card className="border-0 shadow-xl rounded-[2.5rem] bg-white overflow-hidden border border-gray-100">
                                <CardHeader className="p-6 md:p-8 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                            <ChartBar size={18} />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-black tracking-tighter">Yield Attribution</h3>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 md:p-8 pt-0">
                                    <div className="h-72 w-full min-h-[280px]">
                                        {loading || !analytics ? <Skeleton className="w-full h-full" /> : (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analytics?.sourceData || []}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} dy={10} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                                                    <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={24} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-xl rounded-[2.5rem] bg-white overflow-hidden border border-gray-100">
                                <CardHeader className="p-6 md:p-8 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                                            <Sparkles size={18} />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-black tracking-tighter text-black">Thermal Pulse</h3>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 md:p-8 pt-0">
                                    <div className="h-72 w-full min-h-[280px]">
                                        {loading || !analytics ? <Skeleton className="w-full h-full" /> : (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={analytics?.tempData || []}
                                                        innerRadius={65}
                                                        outerRadius={85}
                                                        paddingAngle={8}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {(analytics?.tempData || []).map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                        <div className="flex flex-wrap justify-center gap-4 mt-2">
                                            {analytics?.tempData?.map((t: any) => (
                                                <div key={t.name} className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                                                    <span className="text-[10px] font-bold uppercase text-gray-500">{t.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Card className="border-0 shadow-2xl bg-black text-white rounded-[3rem] p-6 md:p-10 flex flex-col items-center justify-between min-h-[500px] overflow-hidden relative border border-white/5 group">
                        <div className="absolute top-0 left-0 w-full h-40 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
                        <div className="flex flex-col items-center gap-2 mb-8 relative z-10 w-full text-center">
                            <div className="p-4 bg-white/10 rounded-2xl mb-4 shadow-xl border border-white/10 text-amber-400">
                                <Filter size={28} />
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter uppercase italic">The Capture Lab.</h3>
                            <p className="text-xs text-white/40 font-bold tracking-widest uppercase">Funnel Efficiency</p>
                        </div>
                        {loading ? <Skeleton className="w-full h-72 bg-white/5 rounded-3xl" /> : <FunnelUI data={analytics?.stats || { total: 0, contacted: 0, converted: 0 }} />}
                        <div className="w-full mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between z-10">
                             <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">System Health: Optimal</span>
                             <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                    </Card>
                </div>

                <Card className="border-0 shadow-xl overflow-hidden bg-white rounded-[2.5rem] border border-gray-100">
                     <CardHeader className="px-6 md:px-10 py-6 md:py-8 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-50 text-black rounded-2xl border border-gray-100"><Clock size={16} /></div>
                            <CardTitle className="text-xl md:text-2xl font-black tracking-tighter">Audit Trail</CardTitle>
                        </div>
                        <Button variant="outline" className="h-10 w-10 p-0 rounded-xl" onClick={fetchDashboardData}>
                            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6 md:p-10">
                        <div className="space-y-8 relative before:absolute before:left-[21px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                            {loading ? [1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />) : activities?.splice(0, 4).map((act: any) => (
                                <div key={act._id} className="relative flex items-start gap-6 group">
                                    <div className="z-10 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg bg-black text-white group-hover:scale-110 transition-luxury">
                                        {act.action.includes('Created') ? <Plus size={16} /> : <Zap size={16} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                                            <p className="text-[11px] font-black text-black uppercase tracking-wider">{act.action}</p>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">{act.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} onSuccess={fetchDashboardData} />
        </DashboardWrapper>
    );
}

function FunnelUI({ data }: { data: any }) {
    const { total, contacted, converted } = data;
    const contactedPct = total ? Math.round((contacted / total) * 100) : 0;
    const convertedPct = contacted ? Math.round((converted / contacted) * 100) : 0;
    
    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col items-center">
                {/* Captured - White Block */}
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="w-full h-16 bg-white/95 backdrop-blur-xl rounded-2xl flex items-center justify-between px-8 text-black shadow-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Captured</span>
                    <span className="text-2xl font-black">{total}</span>
                </motion.div>
                
                {/* Arrow */}
                <div className="py-2 flex flex-col items-center text-white/20">
                    <ArrowDown size={32} strokeWidth={3} />
                </div>

                {/* Contacted - Slightly smaller glass block */}
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 0.85 }} transition={{ delay: 0.1 }} className="w-full h-16 bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between px-8 text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Contacted</span>
                     <span className="text-2xl font-black">{contacted}</span>
                </motion.div>

                 {/* Arrow */}
                 <div className="py-2 flex flex-col items-center text-white/20">
                    <ArrowDown size={32} strokeWidth={3} />
                </div>

                {/* Converted - Smallest glass block */}
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 0.7 }} transition={{ delay: 0.2 }} className="w-full h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between px-8 text-white/80">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Converted</span>
                    <span className="text-2xl font-black">{converted}</span>
                </motion.div>
            </div>
            
             <div className="mt-8 text-center">
                 <p className="text-[10px] font-black uppercase text-amber-400 tracking-[0.2em] animate-pulse">Efficiency Gap: {100 - convertedPct}% Dropoff</p>
             </div>
        </div>
    );
}
