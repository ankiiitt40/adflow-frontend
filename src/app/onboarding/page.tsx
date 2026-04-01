'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { 
    Building2, 
    Target, 
    MapPin, 
    DollarSign, 
    Magnet, 
    ArrowRight, 
    ArrowLeft, 
    HelpCircle,
    CheckCircle2
} from 'lucide-react';

const steps = [
    { title: 'Business', icon: Building2, description: 'What is the name of your business?' },
    { title: 'Ad Type', icon: Target, description: 'What is your primary goal?' },
    { title: 'Targeting', icon: MapPin, description: 'Where is your audience located?' },
    { title: 'Budget', icon: DollarSign, description: 'How much do you want to spend?' },
    { title: 'Channel', icon: Magnet, description: 'Where should your leads come from?' },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        businessName: '',
        adType: 'Lead Generation',
        city: 'New York',
        age: '25-45',
        budget: '500',
        channel: 'Facebook',
    });

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        router.push('/dashboard');
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white">
            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between items-center mb-4 px-2">
                    {steps.map((step, i) => (
                        <div 
                            key={i} 
                            className={`flex flex-col items-center gap-2 ${i <= currentStep ? 'text-black' : 'text-gray-300'}`}
                        >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                                i < currentStep ? 'bg-black border-black text-white' : 
                                i === currentStep ? 'bg-white border-black text-black shadow-lg scale-110' : 
                                'bg-white border-gray-100 text-gray-300'
                            }`}>
                                {i < currentStep ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">{step.title}</span>
                        </div>
                    ))}
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-black"
                    />
                </div>
            </div>

            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                className="w-full max-w-xl"
            >
                <Card className="shadow-2xl border-0 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-gray-100 via-black to-gray-100" />
                    <CardHeader className="pt-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-black text-white rounded-xl">
                                {(()=>{const Icon=steps[currentStep].icon; return <Icon size={20} />})()}
                            </div>
                            <CardTitle className="text-2xl font-black">Step {currentStep + 1}: {steps[currentStep].title}</CardTitle>
                        </div>
                        <CardDescription className="text-gray-500 text-base font-medium">{steps[currentStep].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pb-10">
                        {currentStep === 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Business Name</label>
                                    <Tooltip text="Your company's legal name.">
                                        <HelpCircle size={14} className="text-gray-400 cursor-help" />
                                    </Tooltip>
                                </div>
                                <Input 
                                    placeholder="Enter your business name"
                                    className="h-12 text-lg font-bold"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                                    autoFocus
                                />
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="grid grid-cols-2 gap-4">
                                {['Lead Generation', 'Direct Sales', 'Brand Awareness', 'Engagement'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({...formData, adType: type})}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all group relative ${
                                            formData.adType === type ? 'border-black bg-black text-white shadow-xl scale-[1.02]' : 'border-gray-50 bg-white hover:border-gray-200'
                                        }`}
                                    >
                                        <div className="font-black mb-1">{type}</div>
                                        <p className={`text-xs ${formData.adType === type ? 'text-gray-300' : 'text-gray-400 font-medium'}`}>Best for medium businesses.</p>
                                        {formData.adType === type && <CheckCircle2 size={16} className="absolute top-4 right-4" />}
                                    </button>
                                ))}
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <Input 
                                    label="Target City"
                                    placeholder="e.g. New York, London, Berlin"
                                    value={formData.city}
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Target Age Group</label>
                                        <Tooltip text="Who are you trying to reach?">
                                            <HelpCircle size={14} className="text-gray-400 cursor-help" />
                                        </Tooltip>
                                    </div>
                                    <div className="flex gap-2">
                                        {['18-24', '25-45', '46-65', '65+'].map((age) => (
                                            <button
                                                key={age}
                                                onClick={() => setFormData({...formData, age})}
                                                className={`flex-1 py-3 rounded-xl border-2 font-black text-xs transition-all ${
                                                    formData.age === age ? 'border-black bg-black text-white' : 'border-gray-50 bg-white text-gray-500'
                                                }`}
                                            >
                                                {age}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Daily Budget</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-4xl font-black text-black tracking-tighter mb-1">$</span>
                                        <span className="text-7xl font-black text-black tracking-tighter">{formData.budget}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="10" 
                                        max="5000" 
                                        step="50"
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mt-8"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="grid grid-cols-1 gap-4">
                                {['Facebook', 'Instagram', 'Google Ads', 'Email', 'WhatsApp'].map((ch) => (
                                    <button
                                        key={ch}
                                        onClick={() => setFormData({...formData, channel: ch})}
                                        className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                                            formData.channel === ch ? 'border-black bg-black text-white shadow-lg' : 'border-gray-50 bg-white hover:border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${formData.channel === ch ? 'bg-white/10' : 'bg-gray-50'}`}>
                                                <Magnet size={18} />
                                            </div>
                                            <span className="font-black">{ch}</span>
                                        </div>
                                        {formData.channel === ch && <CheckCircle2 size={20} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between p-8 border-t border-gray-50 bg-gray-50/50">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="h-12 px-8 rounded-2xl font-bold"
                        >
                            <ArrowLeft size={18} className="mr-2" />
                            Back
                        </Button>
                        <Button
                            onClick={nextStep}
                            className="h-12 px-10 rounded-2xl font-black shadow-xl"
                        >
                            {currentStep === steps.length - 1 ? 'Start Launch' : 'Continue'}
                            <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
