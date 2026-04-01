'use client';
import { DashboardWrapper } from '@/components/layout/DashboardWrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Bell, Shield, CreditCard, Save, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
    const { user, logout } = useAuth();

    return (
        <DashboardWrapper>
            <div className="flex flex-col gap-8 max-w-4xl">
                <div>
                    <h1 className="text-3xl font-black text-black tracking-tight mb-2">Settings</h1>
                    <p className="text-gray-500 font-medium">Manage your personal preferences and account security.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 space-y-2">
                        <button className="w-full flex items-center px-4 py-3 text-sm font-bold bg-black text-white rounded-2xl shadow-lg transition-all">
                            <User size={18} className="mr-3" />
                            Profile
                        </button>
                        <button className="w-full flex items-center px-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-black rounded-2xl transition-all">
                            <Shield size={18} className="mr-3" />
                            Security
                        </button>
                        <button className="w-full flex items-center px-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-black rounded-2xl transition-all">
                            <Bell size={18} className="mr-3" />
                            Notifications
                        </button>
                        <button className="w-full flex items-center px-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-black rounded-2xl transition-all">
                            <CreditCard size={18} className="mr-3" />
                            Billing
                        </button>
                        <hr className="my-4 border-gray-100" />
                        <button 
                            onClick={logout}
                            className="w-full flex items-center px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        >
                            <LogOut size={18} className="mr-3" />
                            Log Out
                        </button>
                    </div>

                    <div className="md:col-span-3 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details here.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <Input 
                                        label="Full Name" 
                                        defaultValue={user?.name} 
                                        className="h-11"
                                    />
                                    <Input 
                                        label="Email Address" 
                                        defaultValue={user?.email} 
                                        type="email" 
                                        className="h-11"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Profile Photo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-2xl text-gray-300">
                                            {user?.name?.[0]}
                                        </div>
                                        <Button variant="outline" size="sm" className="h-10 rounded-xl">
                                            Change Avatar
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end border-t border-gray-50 bg-gray-50/20">
                                <Button className="h-10 shadow-sm font-bold px-6">
                                    <Save size={18} className="mr-2" />
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Role Permissions</CardTitle>
                                <CardDescription>Your current account permissions and role.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl ring-1 ring-gray-100">
                                    <div>
                                        <p className="text-sm font-black text-black">{user?.role}</p>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {user?.role === 'Owner' ? 'Full administrative access across everything.' : 
                                             user?.role === 'Manager' ? 'Access to Leads and Ads management.' : 
                                             'Access to Leads management only.'}
                                        </p>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-tighter shadow-md">
                                        Active
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardWrapper>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
