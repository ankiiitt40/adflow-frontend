'use client';
import { DashboardWrapper } from '@/components/layout/DashboardWrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { 
  BookOpen, 
  Zap, 
  Signal, 
  Cpu, 
  MessageSquare, 
  Download, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

const sections = [
  {
    title: '1. The Signal Node (Webhooks)',
    description: 'Learn how to ingest leads from Meta, Google, and external URLs.',
    icon: Signal,
    color: 'bg-orange-50 text-orange-600',
    steps: [
      'Navigate to the "Ads Command" page.',
      'Copy your unique "Signal Node URL".',
      'Paste this URL into your Meta/Google Ads webhook settings.',
      'All incoming leads will be instantly processed by AI.'
    ]
  },
  {
    title: '2. AI Scoring & Intent Thermal',
    description: 'Understand how AdFlow qualifies your prospects automatically.',
    icon: Cpu,
    color: 'bg-indigo-50 text-indigo-600',
    steps: [
      'Every lead is analyzed by OpenAI upon arrival.',
      'Leads are assigned a score from 0-100.',
      'Thermal status (Hot, Warm, Cold) is calculated based on context.',
      'Check the "Insights" chip for AI-generated buyer intent summaries.'
    ]
  },
  {
    title: '3. Command Center (Management)',
    description: 'Efficiently handle your acquisition pipeline.',
    icon: TrendingUp,
    color: 'bg-emerald-50 text-emerald-600',
    steps: [
      'Go to the "Leads Command" to see your lead matrix.',
      'Update "Phase" status (New, Contacted, Converted) as you work.',
      'Use the "Export" button to download a 1-click CSV report.',
      'Assign leads to team members using the "Assignment" dropdown.'
    ]
  },
  {
    title: '4. Automation Triggers',
    description: 'Scale your response times with n8n and Webhooks.',
    icon: Zap,
    color: 'bg-amber-50 text-amber-600',
    steps: [
      'Go to "Automation Hub" to configure response logic.',
      'Enter your n8n Webhook URL for SMS/WhatsApp triggers.',
      'Customize follow-up messages using AI-suggested templates.',
      'Enable/Disable specific automation nodes as needed.'
    ]
  }
];

export default function DocsPage() {
    return (
        <DashboardWrapper>
            <div className="flex flex-col gap-10 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-black tracking-tighter mb-2">Knowledge Base.</h1>
                        <div className="flex items-center gap-2 text-gray-500 font-medium tracking-tight font-black uppercase text-[10px] tracking-widest">
                            <BookOpen size={16} className="text-black" />
                            <span>Universal Documentation & Deployment Manual</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                        <Globe size={18} className="text-black" />
                        <span className="text-xs font-black uppercase tracking-widest text-black">Cloud Protocol: Active</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx}
                        >
                            <Card className="h-full border-0 shadow-3xl bg-white rounded-[2rem] overflow-hidden group hover:shadow-4xl transition-all duration-500 border border-gray-50">
                                <CardHeader className="py-8 px-10 border-b border-gray-50">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-3xl ${section.color} shadow-lg transition-transform group-hover:scale-110`}>
                                            <section.icon size={28} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black text-black tracking-tighter">{section.title}</CardTitle>
                                            <CardDescription className="text-xs font-medium text-gray-500">{section.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="py-8 px-10">
                                    <ul className="space-y-4">
                                        {section.steps.map((step, sIdx) => (
                                            <li key={sIdx} className="flex items-start gap-4">
                                                <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-black border border-gray-100">
                                                    {sIdx + 1}
                                                </div>
                                                <p className="text-sm font-medium text-gray-600 leading-relaxed">{step}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <Card className="border-0 bg-black text-white rounded-[2.5rem] p-12 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                <ShieldCheck className="text-white" size={24} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic">Security & Infrastructure</h2>
                        </div>
                        <p className="text-gray-400 max-w-2xl text-lg font-medium leading-relaxed">
                            AdFlow is built on a resilient decoupled architecture. Even if your external services experience downtime, our internal <span className="text-white font-black">Circuit Breaker</span> protocol ensures no leads are lost. Your data remains encrypted and accessible across our global CDN.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <span className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">End-to-End Encryption</span>
                            <span className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">99.9% Uptime Guarantee</span>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardWrapper>
    );
}
