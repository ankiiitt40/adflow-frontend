'use client';
import { useState, useEffect } from 'react';
import { DashboardWrapper } from '@/components/layout/DashboardWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Zap, Globe, ShieldCheck, Copy, ChevronDown, ChevronUp, 
  BarChart3, Webhook, Workflow, ArrowUpRight, Target, 
  Terminal, Activity, Cpu, TrendingDown, Layers, Sparkles, Command
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { toast } from '@/components/ui/Toast';
import { API_BASE, API_URL } from '@/config/api';

const PLATFORM_STEPS = {
    meta: {
        id: 'meta', title: 'Meta Ecosystem', color: 'indigo',
        link: 'https://business.facebook.com/latest/ads_manager',
        steps: ['Ads Manager > Form Settings', 'Webhook CRM Config', 'Paste Signal Node URL', 'Verify Connection']
    },
    google: {
        id: 'google', title: 'Google Network', color: 'amber',
        link: 'https://ads.google.com/nav/conversions',
        steps: ['Conversions > Lead Forms', 'Webhook Setup', 'Paste Signal Node URL', 'Test Handshake']
    }
};

export default function AdsPage() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'campaigns' | 'strategy'>('campaigns');
    const [openGuide, setOpenGuide] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setAnalytics(res.data.data);
        } catch (err) {
            console.error('Analytics Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const webhookUrl = `${API_BASE}/leads/webhook/lead?userId=${user?.id || user?._id}`;

    const copyNode = () => {
        navigator.clipboard.writeText(webhookUrl);
        toast('Signal Node URL copied!', 'success');
    };

    const totalLeads = analytics?.stats?.total || 0;
    const sourceData = analytics?.sourceData || [];
    const facebookLeads = sourceData.find((s: any) => s.name === 'Facebook')?.value || 0;
    const googleLeads = sourceData.find((s: any) => s.name === 'Google')?.value || 0;
    const directLeads = sourceData.find((s: any) => s.name === 'Direct')?.value || 0;

    return (
        <DashboardWrapper>
            <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-700 flex flex-col gap-10">
                
                {/* 🌌 Master UI Header (Stable) */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-gray-100 pb-12">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-4">
                            <Sparkles size={12} className="text-indigo-600" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-700">Adflow Quantum v4.0</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-black tracking-tighter leading-none italic uppercase">
                            Ad Hub.
                        </h1>
                        <p className="text-gray-400 mt-4 text-base font-medium italic opacity-70">
                            Centralized acquisition terminal. Every signal node is analyzed by Adflow logic engines in real-time.
                        </p>
                    </div>

                    <div className="flex bg-gray-50 p-1.5 rounded-[1.8rem] border border-white shadow-inner shrink-0">
                        <button 
                            onClick={() => setActiveTab('campaigns')}
                            className={`px-8 py-4 text-[10px] font-black uppercase rounded-[1.4rem] transition-all duration-300 flex items-center gap-2 ${
                                activeTab === 'campaigns' ? 'bg-black text-white shadow-xl scale-105' : 'text-gray-400 hover:text-black'
                            }`}
                        >
                            <Target size={14} className="shrink-0" /> Link Nodes
                        </button>
                        <button 
                            onClick={() => setActiveTab('strategy')}
                            className={`px-8 py-4 text-[10px] font-black uppercase rounded-[1.4rem] transition-all duration-300 flex items-center gap-2 ${
                                activeTab === 'strategy' ? 'bg-black text-white shadow-xl scale-105' : 'text-gray-400 hover:text-black'
                            }`}
                        >
                            <Workflow size={14} className="shrink-0" /> Strategy
                        </button>
                    </div>
                </div>

                {activeTab === 'campaigns' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
                        
                        {/* 🚀 LEFT SECTION: Guide & Node Setup (lg:col-span-4) */}
                        <div className="lg:col-span-4 flex flex-col gap-8">
                             <Card className="border-0 shadow-lg rounded-[2.5rem] bg-white p-8 border border-gray-50 flex flex-col gap-8 min-h-[400px]">
                                <div className="space-y-4">
                                    <div className="p-3 bg-indigo-50 rounded-2xl w-fit"><Globe size={24} className="text-indigo-600" /></div>
                                    <h3 className="text-xl font-black italic tracking-tighter uppercase">Ecosystem Connect.</h3>
                                    <p className="text-xs font-bold text-gray-400 italic">Initiate the handshake protocol on your lead sources below.</p>
                                </div>

                                <div className="space-y-4">
                                    {[PLATFORM_STEPS.meta, PLATFORM_STEPS.google].map((platform) => (
                                        <div key={platform.id} className="space-y-3">
                                            <button 
                                                onClick={() => setOpenGuide(openGuide === platform.id ? null : platform.id)}
                                                className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                                                    openGuide === platform.id ? 'bg-black text-white border-black shadow-xl translate-x-2' : 'bg-gray-50 border-gray-100 hover:border-black'
                                                }`}
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest">{platform.title} Setup</span>
                                                {openGuide === platform.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                            
                                            {openGuide === platform.id && (
                                                <div className="px-4 py-2 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                                    {platform.steps.map((step, i) => (
                                                        <div key={i} className="flex gap-3 items-center">
                                                            <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[9px] font-black shrink-0">{i+1}</div>
                                                            <p className="text-[10px] text-gray-400 font-bold italic" dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<b class="text-black font-black">$1</b>') }} />
                                                        </div>
                                                    ))}
                                                    <a href={(platform as any).link} target="_blank" rel="noopener noreferrer">
                                                        <Button className="w-full bg-white text-black border border-gray-100 rounded-xl h-10 text-[9px] uppercase font-black tracking-widest hover:bg-black hover:text-white transition-all">
                                                           Open Dashboard <ArrowUpRight size={14} className="ml-1" />
                                                        </Button>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                             </Card>

                             <Card className="border-0 shadow-lg rounded-[2.5rem] bg-indigo-600 text-white p-10 text-center flex flex-col items-center gap-6 group hover:translate-y-[-4px] transition-all duration-500 min-h-[300px] justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full -mr-10 -mt-10" />
                                <Activity size={40} className="mb-2 opacity-50" />
                                <h4 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Sync Verified.</h4>
                                <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] italic max-w-[180px]">Active Adflow Quantum Pulse handshake.</p>
                             </Card>
                        </div>

                        {/* 💎 MAIN CONTENT: Master Terminal (lg:col-span-8) */}
                        <div className="lg:col-span-8 flex flex-col gap-8">
                             <div className="flex flex-col gap-8">
                                 {/* SIGNAL NODE CARD (Ultra-Stable) */}
                                 <Card className="border-0 shadow-2xl rounded-[3.5rem] bg-[#0A0A0A] text-white p-10 md:p-14 overflow-hidden relative border border-white/10 min-h-[500px] flex flex-col justify-between group transition-all duration-700">
                                    <div className="absolute top-0 left-0 w-1/2 h-full bg-indigo-600/5 blur-[120px] rounded-full -ml-40 -mt-40 pointer-events-none" />
                                    
                                    <div className="relative z-10 flex flex-col gap-14">
                                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                                            <div className="space-y-6">
                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/10 backdrop-blur-3xl">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Operational Node Entry</span>
                                                </div>
                                                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] italic uppercase">Signal.</h2>
                                            </div>
                                            <div className="flex items-center gap-5 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-center shadow-2xl shrink-0">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic mb-2 leading-none">Node Captures</p>
                                                    <p className="text-5xl font-black italic tracking-tighter leading-none">{totalLeads}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 shadow-inner backdrop-blur-3xl relative group/node overflow-hidden transition-all hover:bg-white/10">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3 text-indigo-400">
                                                    <Terminal size={22} className="shrink-0" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Signal Target Endpoint</span>
                                                </div>
                                                <Copy size={20} className="text-white/20 group-hover/node:text-indigo-400 shrink-0 cursor-pointer" onClick={copyNode} />
                                            </div>
                                            <div className="font-mono text-sm md:text-base text-white/40 break-all select-all font-bold line-clamp-2 md:line-clamp-none cursor-pointer" onClick={copyNode}>
                                                {loading ? 'Synthesizing Path...' : webhookUrl}
                                            </div>
                                            <Button 
                                                onClick={copyNode}
                                                className="mt-8 h-14 w-full bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-[1.01] transition-all italic"
                                            >
                                                Synthesize Node Copy
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: 'Latency', value: '14ms', icon: Command, color: 'indigo' },
                                                { label: 'Pulse Score', value: (analytics?.stats?.avgScore || 0), icon: Activity, color: 'emerald' },
                                                { label: 'Security', value: 'E2EE', icon: ShieldCheck, color: 'indigo' },
                                                { label: 'Uptime', value: '99.9%', icon: Cpu, color: 'emerald' }
                                            ].map((m, i) => (
                                                <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                                                    <div className="flex items-center gap-2 mb-2 text-white/20">
                                                        <m.icon size={12} className="shrink-0" />
                                                        <span className="text-[8px] font-black uppercase tracking-widest leading-none">{m.label}</span>
                                                    </div>
                                                    <p className="text-xl font-black italic tracking-tighter leading-none">{m.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                 </Card>

                                 {/* 📈 ANALYTICS ROW (Stable Bento Grid) */}
                                 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8">
                                     <Card className="md:col-span-8 border-0 shadow-lg bg-white rounded-[3rem] p-10 border border-gray-100 flex flex-col md:flex-row items-center gap-10 group overflow-hidden">
                                        <div className="w-full md:w-auto flex flex-col gap-2 shrink-0">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-black text-white rounded-2xl"><BarChart3 size={20} /></div>
                                                <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none italic">Attr Matrix.</h3>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full space-y-6">
                                            {[
                                                { label: 'Meta HUB', value: facebookLeads, total: totalLeads || 1, color: 'bg-black' },
                                                { label: 'Google HUB', value: googleLeads, total: totalLeads || 1, color: 'bg-indigo-600' }
                                            ].map((p, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                        <span>{p.label}</span>
                                                        <span className="text-black">{totalLeads > 0 ? p.value : 0} nodes</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner flex">
                                                        <div className={`h-full ${p.color} transition-all duration-1000 ease-out flex-shrink-0`} style={{ width: `${totalLeads > 0 ? (p.value / (totalLeads || 1)) * 100 : 0}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                     </Card>

                                     <Card className="md:col-span-4 border-0 shadow-lg bg-gray-50 rounded-[3rem] p-10 border border-gray-100 flex flex-col items-center justify-center text-center group hover:bg-black transition-all duration-500 group">
                                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white/40 mb-2 leading-none italic">Quality Score</p>
                                          <p className="text-5xl font-black italic tracking-tighter text-black group-hover:text-indigo-400 transition-all">{analytics?.stats?.avgScore || 0}</p>
                                     </Card>
                                 </div>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in zoom-in-95 duration-500">
                        {/* 🛡️ STRATEGY VIEW (Clean Stable) */}
                        <div className="col-span-full border-b border-gray-100 pb-12">
                             <h2 className="text-4xl md:text-7xl font-black tracking-tighter italic leading-none uppercase">Protocols.</h2>
                             <p className="text-base text-gray-400 font-bold uppercase tracking-widest mt-4 max-w-xl italic opacity-60">Autonomous routing engines for lead handshakes.</p>
                        </div>
                        {[
                            { name: 'Hot Node Direct', trigger: 'Score > 85', action: 'WhatsApp', icon: ShieldCheck },
                            { name: 'Nurture Tunnel', trigger: 'Score < 50', action: 'Email Drip', icon: Activity },
                            { name: 'Smart Routing', trigger: 'Google Source', action: 'Team Assign', icon: Workflow }
                        ].map((s, i) => (
                            <Card key={i} className="border-0 shadow-lg rounded-[3rem] bg-white p-10 border border-gray-100 flex flex-col justify-between group hover:border-black transition-all duration-500 min-h-[400px]">
                                <div className="space-y-10">
                                    <div className="flex justify-between items-center">
                                        <div className="p-5 bg-gray-50 text-black rounded-[1.5rem] group-hover:bg-black group-hover:text-white transition-all shadow-inner"><s.icon size={28} /></div>
                                        <span className="text-[9px] font-black uppercase text-gray-300 italic tracking-widest">Logic Node-0{i+1}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-6">{s.name}</h3>
                                        <div className="space-y-3">
                                             <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl text-[10px] font-black italic">
                                                <span className="uppercase text-gray-400 tracking-widest">Trigger IF</span>
                                                <span className="text-black">{s.trigger}</span>
                                             </div>
                                             <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl text-[10px] font-black italic">
                                                <span className="uppercase text-gray-400 tracking-widest">Action</span>
                                                <span className="text-black">{s.action}</span>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                                <Button className="h-14 w-full bg-black text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest mt-8 hover:scale-[1.02] transition-all">
                                    Tune Protocol Matrix
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardWrapper>
    );
}
