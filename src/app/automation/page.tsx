'use client';
import { useState, useEffect } from 'react';
import { DashboardWrapper } from '@/components/layout/DashboardWrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { 
  Save, 
  MessageSquare, 
  Sparkles, 
  Send, 
  Smartphone, 
  CheckCircle2, 
  Zap,
  Briefcase,
  Building2,
  Users,
  Bell,
  Link,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import { toast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '@/config/api';

const businessSuggestions = [
  {
    id: 'coaching',
    name: 'Coaching',
    icon: Users,
    color: 'bg-indigo-50 text-indigo-600',
    welcome: 'Hi {{name}}, thanks for reaching out! Let\'s scale your growth together. When are you free for a 15-min strategy session?',
    followUp1: 'Hey {{name}}, just checking in. Most of my clients see results in the first 30 days. Ready to start?',
    followUp2: 'Hi {{name}}, limited spots left for my masterclass. Don\'t miss out!'
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: Building2,
    color: 'bg-amber-50 text-amber-600',
    welcome: 'Hello {{name}}! 👋 I saw you\'re interested in our new listings. Would you like a virtual tour link?',
    followUp1: 'Hi {{name}}, we have 3 similar properties coming to market soon. Want first access?',
    followUp2: 'Hi {{name}}, interest rates just dropped. Now is the perfect time to buy!'
  },
  {
    id: 'service',
    name: 'Services',
    icon: Briefcase,
    color: 'bg-green-50 text-green-600',
    welcome: 'Hi {{name}}, thanks for your inquiry! Our team is ready to help. Can I send you our pricing brochure?',
    followUp1: 'Hey {{name}}, just wanted to see if you had any questions about our service packages.',
    followUp2: 'Hi {{name}}, book by Friday and get 15% off your first month!'
  }
];

export default function AutomationPage() {
    const [settings, setSettings] = useState({
        welcomeMessage: '',
        followUp1: '',
        followUp2: '',
        telegramEnabled: true,
        whatsappEnabled: false,
        n8nEnabled: false,
        n8nWebhookUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Endpoint correction: /automation (no /settings)
            const res = await axios.get(`${API_BASE}/automation`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.data) {
                setSettings(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            // Endpoint correction: /automation
            await axios.patch(`${API_BASE}/automation`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast('Automation cluster secured!', 'success');
        } catch (err) {
            toast('Security failed during sync', 'error');
        } finally {
            setSaving(false);
        }
    };

    const applySuggestion = (suggestion: any) => {
        setSettings({
            ...settings,
            welcomeMessage: suggestion.welcome,
            followUp1: suggestion.followUp1,
            followUp2: suggestion.followUp2
        });
        toast(`${suggestion.name} logic packs applied!`, 'success');
    };

    const PreviewMessage = ({ text, title }: { text: string, title?: string }) => (
        <div className="space-y-1.5 animate-premium">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">{title}</span>
            <div className="p-3 bg-gray-100 rounded-2xl rounded-tl-none text-xs text-black font-medium max-w-[200px] shadow-sm">
                {text?.replace('{{name}}', 'John') || 'Awaiting signal...'}
            </div>
        </div>
    );

    return (
        <DashboardWrapper>
            <div className="flex flex-col gap-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-black tracking-tighter mb-2">Automations.</h1>
                        <p className="text-gray-500 font-medium tracking-tight">Multi-trigger response sequences and channel routing terminal.</p>
                    </div>
                    <Button 
                        onClick={handleSave} 
                        isLoading={saving}
                        className="h-12 px-10 bg-black text-white shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-luxury rounded-2xl"
                    >
                        <Save size={18} className="mr-2" />
                        Save Deployment
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <TriggerControl 
                        title="Telegram Broadcast" 
                        description="Instant dispatch to your monitoring room." 
                        enabled={settings.telegramEnabled} 
                        icon={Bell} 
                        onToggle={() => setSettings({...settings, telegramEnabled: !settings.telegramEnabled})} 
                    />
                    <TriggerControl 
                        title="WhatsApp Webhook" 
                        description="Real-time greeting and follow-ups." 
                        enabled={settings.whatsappEnabled} 
                        icon={Smartphone} 
                        onToggle={() => setSettings({...settings, whatsappEnabled: !settings.whatsappEnabled})} 
                    />
                    <TriggerControl 
                        title="n8n Integration" 
                        description="Powerful logic flows and CRM sync." 
                        enabled={settings.n8nEnabled} 
                        icon={Zap} 
                        onToggle={() => setSettings({...settings, n8nEnabled: !settings.n8nEnabled})} 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2 space-y-12">
                        <AnimatePresence>
                            {settings.n8nEnabled && (
                                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                    <Card className="border-0 shadow-xl bg-indigo-50/30 rounded-3xl p-8 border border-indigo-100/50">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg"><Link size={18} /></div>
                                                <h3 className="text-xl font-black text-indigo-900 tracking-tight">n8n Workflow Secret.</h3>
                                            </div>
                                            <Input 
                                                placeholder="https://n8n.your-domain.com/webhook/..." 
                                                className="h-14 border-indigo-100 bg-white/80 focus:bg-white text-xs font-mono" 
                                                value={settings.n8nWebhookUrl}
                                                onChange={(e) => setSettings({...settings, n8nWebhookUrl: e.target.value})}
                                            />
                                        </div>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} className="text-amber-500" fill="currentColor" />
                                <h3 className="text-sm font-black text-black">Intelligence Clusters</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {businessSuggestions.map((suggestion) => (
                                    <div 
                                        key={suggestion.id}
                                        onClick={() => applySuggestion(suggestion)}
                                        className="group cursor-pointer p-6 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-luxury border border-gray-50 flex flex-col justify-between"
                                    >
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className={`p-3 rounded-2xl ${suggestion.color}`}><suggestion.icon size={20} /></div>
                                            <h4 className="text-base font-black text-black tracking-tight">{suggestion.name}</h4>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-400 group-hover:text-black transition-luxury">
                                            <span>Inject Pack</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-luxury" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden glass p-10 pt-8">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="p-2 bg-black text-white rounded-xl shadow-lg"><MessageSquare size={18} /></div>
                                <h3 className="text-2xl font-black text-black tracking-tighter">Response Matrix.</h3>
                            </div>
                            <div className="space-y-10">
                                <ResponseField 
                                    label="Welcome Signal (Trigger 0s)" 
                                    value={settings.welcomeMessage} 
                                    onChange={(val) => setSettings({...settings, welcomeMessage: val})} 
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                     <ResponseField 
                                        label="Drip Phase 1 (24h)" 
                                        value={settings.followUp1} 
                                        onChange={(val) => setSettings({...settings, followUp1: val})} 
                                    />
                                     <ResponseField 
                                        label="Drip Phase 2 (48h)" 
                                        value={settings.followUp2} 
                                        onChange={(val) => setSettings({...settings, followUp2: val})} 
                                    />
                                </div>
                                <div className="p-6 bg-black rounded-3xl flex gap-4 items-center ring-4 ring-gray-50 shadow-2xl">
                                    <ShieldCheck size={24} className="text-indigo-400" />
                                    <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.1em] leading-relaxed">
                                        Active Parser: <span className="text-white">{"{{name}}"}</span> is live.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="sticky top-10 space-y-8">
                        <div className="relative mx-auto w-[300px] h-[620px] bg-black rounded-[50px] shadow-3xl border-[10px] border-gray-900 p-4">
                            <div className="w-full h-full bg-white rounded-[35px] overflow-hidden flex flex-col relative">
                                <div className="h-10 flex items-center justify-between px-8 pt-4">
                                    <span className="text-xs font-black">12:30</span>
                                    <div className="flex gap-1.5"><div className="w-4 h-2 bg-black/10 rounded-full" /><div className="w-4 h-2 bg-black rounded-full" /></div>
                                </div>
                                <div className="p-6 pt-2 border-b border-gray-50 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xs shadow-xl">AF</div>
                                    <div><h4 className="text-xs font-black tracking-tight">System Node</h4><p className="text-[9px] text-green-500 font-black uppercase tracking-tighter">Live</p></div>
                                </div>
                                <div className="flex-1 p-6 space-y-8 overflow-y-auto bg-gray-50/30">
                                    <PreviewMessage title="Stage 0" text={settings.welcomeMessage} />
                                    <PreviewMessage title="Stage 1" text={settings.followUp1} />
                                    <PreviewMessage title="Stage 2" text={settings.followUp2} />
                                </div>
                                <div className="p-6 border-t border-gray-100 bg-white"><div className="h-10 bg-gray-50 rounded-2xl flex items-center px-6 gap-3"><div className="flex-1 h-3 bg-gray-200 rounded-full shadow-inner" /><Send size={14} className="text-indigo-500" /></div></div>
                            </div>
                            <div className="absolute top-12 left-4 w-3 h-[40%] bg-white/20 blur-2xl rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardWrapper>
    );
}

function TriggerControl({ title, description, enabled, icon: Icon, onToggle }: any) {
    return (
        <Card className="border-0 shadow-lg hover:shadow-2xl transition-luxury rounded-3xl p-8 overflow-hidden relative border border-gray-100">
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-4 rounded-2xl ${enabled ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'} shadow-xl transition-luxury`}><Icon size={24} /></div>
                <button onClick={onToggle} className={`w-14 h-8 rounded-full p-1 transition-luxury flex items-center shadow-inner ${enabled ? 'bg-green-500' : 'bg-gray-200'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-luxury ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>
            <h4 className="text-lg font-black text-black tracking-tight mb-2 relative z-10">{title}.</h4>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest relative z-10">{description}</p>
        </Card>
    );
}

function ResponseField({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-3">
             <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">{label}</label>
             <textarea 
                className="w-full p-6 bg-gray-50/50 rounded-3xl border-0 focus:ring-4 focus:ring-black/5 focus:bg-white outline-none min-h-[140px] text-xs font-medium leading-relaxed transition-luxury shadow-inner border border-gray-100"
                placeholder={`Drafting ${label.toLowerCase()}...`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
             />
        </div>
    );
}
