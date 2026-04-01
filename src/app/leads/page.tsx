'use client';
import { useState, useEffect } from 'react';
import { DashboardWrapper } from '@/components/layout/DashboardWrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Trash2, 
  CheckCircle, 
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Zap,
  RotateCw,
  Download
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { API_BASE } from '@/config/api';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge, getStatusVariant, getScoreBadge } from '@/components/ui/Badge';
import { LeadModal } from '@/components/leads/LeadModal';
import { toast } from '@/components/ui/Toast';

const sources = ['Google', 'Facebook', 'Instagram', 'Direct', 'Email'];

export default function LeadsPage() {
    const { user } = useAuth();
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [agents, setAgents] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

    useEffect(() => {
        fetchLeads();
        if (user?.role !== 'Agent') {
            fetchAgents();
        }
    }, [statusFilter, sourceFilter, user]);

    const fetchAgents = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/users/agents`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setAgents(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching agents:', err);
        }
    };

    const assignLead = async (leadId: string, agentId: string) => {
        try {
            setActionLoading(leadId);
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${API_BASE}/leads/${leadId}`, { assignedTo: agentId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setLeads(leads.map(l => l._id === leadId ? res.data.data : l));
                toast(`Lead assigned successfully`, 'success');
            }
        } catch (err) {
            toast('Assignment failed', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let url = `${API_BASE}/leads?`;
            if (statusFilter) url += `status=${statusFilter}&`;
            if (sourceFilter) url += `source=${sourceFilter}&`;
            
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setLeads(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching leads:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            setActionLoading(id);
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${API_BASE}/leads/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setLeads(leads.map(l => l._id === id ? res.data.data : l));
                toast(`Lead marked as ${status}`, 'success');
            }
        } catch (err) {
            toast('Status update failed', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const sendMessage = (name: string, phone: string, suggestedMessage?: string) => {
        const text = encodeURIComponent(suggestedMessage || `Hi ${name}, I'm reaching out from AdFlow regarding your inquiry!`);
        window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${text}`, '_blank');
        toast('Redirecting to WhatsApp...', 'success');
    };

    const generateTestLead = async () => {
        try {
            setActionLoading('test-lead');
            const names = ['John Carter', 'Sarah Connor', 'Ellen Ripley', 'Arthur Dent', 'Tony Stark', 'Wanda Maximoff'];
            const contexts = [
                'Looking for a 3BHK flat in Mumbai South with sea view.',
                'Interested in the Ultra Python Masterclass for AI.',
                'Just wanted to check pricing for the SaaS yearly plan.',
                'Urgently need a real estate consultant for commercial property.',
                'Need branding services for a new startup.'
            ];
            
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomPhone = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
            const randomSource = sources[Math.floor(Math.random() * sources.length)] || 'Simulated';
            const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
            
            const token = localStorage.getItem('token');
            const userId = user?.id || user?._id;

            await axios.post(`${API_BASE}/leads/webhook/lead`, {
                name: randomName,
                phone: String(randomPhone),
                source: randomSource,
                userId: userId,
                context: randomContext
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast('Simulated Lead Generated!', 'success');
            fetchLeads();
        } catch (err: any) {
            console.error('Simulation Failed:', err.response?.data);
            toast(err.response?.data?.error || 'Simulation Failed', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const downloadCSV = () => {
        if (leads.length === 0) return toast('No data to export!', 'error');
        
        const headers = ['Name', 'Phone', 'Source', 'Status', 'Score', 'AI Insights', 'Temperature'];
        const csvRows = leads.map(l => [
            `"${l.name}"`,
            `"${l.phone}"`,
            `"${l.source}"`,
            `"${l.status}"`,
            `"${l.score}"`,
            `"${(l.aiInsights || '').replace(/"/g, '""')}"`,
            `"${l.temperature || 'Unknown'}"`
        ]);
        
        const csvContent = headers.join(',') + '\n' + csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `adflow_leads_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast('Lead Matrix Exported!', 'success');
    };

    const filteredLeads = leads.filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone.includes(searchTerm)
    );

    return (
        <DashboardWrapper>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-black tracking-tighter mb-2">Leads Command.</h1>
                        <div className="flex items-center gap-2 text-gray-500 font-medium tracking-tight">
                            <TrendingUp size={16} />
                            <span>Exploration of captured interest points across the ecosystem.</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {process.env.NODE_ENV === 'development' && (
                            <button 
                                onClick={generateTestLead} 
                                disabled={actionLoading === 'test-lead'}
                                className="bg-black text-white hover:bg-gray-800 h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-luxury flex items-center gap-2"
                            >
                                {actionLoading === 'test-lead' ? <RotateCw className="animate-spin" size={16} /> : <Zap size={16} />}
                                Simulate Capture
                            </button>
                        )}
                        <Button 
                            onClick={downloadCSV} 
                            className="bg-white border-2 border-gray-100 text-gray-500 h-12 px-6 rounded-2xl font-black hover:bg-gray-50 hover:border-black hover:text-black transition-luxury shadow-lg"
                            title="Export to CSV"
                        >
                            <Download size={20} className="mr-2" />
                            Export
                        </Button>
                        <Button onClick={() => setIsLeadModalOpen(true)} className="bg-white border-2 border-black text-black h-12 px-8 rounded-2xl font-black hover:bg-black hover:text-white transition-luxury shadow-lg">
                            <Plus size={20} className="mr-2" />
                            Direct Lead
                        </Button>
                    </div>
                </div>

                <Card className="border-0 shadow-3xl bg-white border-gray-100 rounded-[2rem] overflow-hidden">
                    <CardHeader className="flex-row flex-wrap items-center justify-between gap-8 py-10 px-10 border-b border-gray-50">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <Input 
                                placeholder="Search captures..." 
                                className="pl-12 h-14 border-gray-100 bg-gray-50 focus:bg-white text-base transition-luxury rounded-2xl group shadow-inner" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-8 items-center flex-wrap">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Pipe Stage</span>
                                <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner">
                                    {['', 'New', 'Contacted', 'Converted'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setStatusFilter(s)}
                                            className={`px-4 py-2.5 text-[10px] font-black uppercase rounded-xl transition-luxury ${
                                                statusFilter === s ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-400 hover:text-gray-800'
                                            }`}
                                        >
                                            {s || 'All'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto min-h-[600px]">
                            {loading ? (
                                <div className="p-10 space-y-4">
                                    {[1, 2, 3, 4, 5, 6].map((i) => <TableRowSkeleton key={i} />)}
                                </div>
                            ) : filteredLeads.length > 0 ? (
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                        <tr>
                                            <th className="px-10 py-6">Identity</th>
                                            <th className="px-8 py-6 text-center">Score</th>
                                            <th className="px-8 py-6 text-center">Assignment</th>
                                            <th className="px-8 py-6 text-center">Phase</th>
                                            <th className="px-10 py-6 text-right">Command</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredLeads.map((lead) => {
                                            const scoreInfo = lead.temperature 
                                                ? { label: `${lead.temperature === 'Hot' ? '🔥' : lead.temperature === 'Warm' ? '⚡' : '❄️'} ${lead.temperature}`, variant: lead.temperature === 'Hot' ? 'red' : lead.temperature === 'Warm' ? 'yellow' : 'blue' }
                                                : getScoreBadge(lead.score);
                                            const isProcessing = actionLoading === lead._id;
                                            return (
                                                <tr key={lead._id} className="hover:bg-gray-50/30 transition-luxury group">
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-14 h-14 rounded-3xl bg-black text-white flex items-center justify-center font-black text-xl shadow-2xl transition-luxury group-hover:scale-110">
                                                                {lead.name[0]}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="text-lg font-black text-black leading-none tracking-tighter">{lead.name}</div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-black uppercase text-gray-300 leading-none">{lead.phone}</span>
                                                                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                                                                    <span className="text-[10px] font-black uppercase text-gray-400 leading-none">{lead.source}</span>
                                                                    {lead.aiInsights && (
                                                                        <>
                                                                            <div className="w-1 h-1 bg-gray-200 rounded-full" />
                                                                            <span className="text-[9px] font-medium text-indigo-500 italic leading-none truncate max-w-[150px]">{lead.aiInsights}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-8 text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <Badge variant={scoreInfo.variant as any} className="py-1.5 px-4 rounded-xl ring-2 shadow-sm">
                                                                {scoreInfo.label}
                                                            </Badge>
                                                            <span className="text-[9px] font-black text-gray-300 uppercase">{lead.score}/100</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-8 text-center text-xs font-black uppercase text-gray-500">
                                                        {user?.role === 'Owner' ? (
                                                            <select 
                                                                className="bg-gray-50 border-gray-100 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                                                                value={typeof lead.assignedTo === 'object' ? lead.assignedTo?._id : (lead.assignedTo || '')}
                                                                onChange={(e) => assignLead(lead._id, e.target.value)}
                                                                disabled={actionLoading === lead._id}
                                                            >
                                                                <option value="">Unassigned</option>
                                                                {agents.map(a => (
                                                                    <option key={a._id} value={a._id}>{a.name}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <span>{typeof lead.assignedTo === 'object' ? lead.assignedTo?.name : 'Unassigned'}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-8 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Badge variant={getStatusVariant(lead.status)} className="py-1.5 px-4 rounded-xl">
                                                                {lead.status}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8 text-right">
                                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-luxury">
                                                            <button 
                                                                onClick={() => sendMessage(lead.name, lead.phone, lead.suggestedMessage)}
                                                                className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-500 hover:text-white transition-luxury shadow-lg"
                                                                title="Reply via WhatsApp"
                                                            >
                                                                <MessageSquare size={20} />
                                                            </button>
                                                            <button 
                                                                disabled={isProcessing || lead.status === 'Converted'}
                                                                onClick={() => updateStatus(lead._id, 'Converted')}
                                                                className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-500 hover:text-white transition-luxury shadow-lg disabled:opacity-30"
                                                            >
                                                                <CheckCircle size={20} />
                                                            </button>
                                                            {lead.status === 'New' && (
                                                                <button 
                                                                    disabled={isProcessing}
                                                                    onClick={() => updateStatus(lead._id, 'Contacted')}
                                                                    className="p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-500 hover:text-white transition-luxury shadow-lg"
                                                                >
                                                                    <ArrowRight size={20} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <EmptyState 
                                    title="Zero data intersections found."
                                    description="No entities matching your specific matrix are found. Use a simulation trigger to populate for testing."
                                    icon={TrendingUp}
                                    actionLabel="Reset System"
                                    onAction={() => { setStatusFilter(''); setSourceFilter(''); setSearchTerm(''); }}
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <LeadModal 
                isOpen={isLeadModalOpen} 
                onClose={() => setIsLeadModalOpen(false)} 
                onSuccess={fetchLeads}
            />
        </DashboardWrapper>
    );
}
