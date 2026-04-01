'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  Zap, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', permission: 'dashboard' },
  { name: 'Leads', icon: Zap, path: '/leads', permission: 'leads' },
  { name: 'Team', icon: Users, path: '/team', permission: 'owner' },
  { name: 'Ads', icon: Megaphone, path: '/ads', permission: 'ads' },
  { name: 'Automation', icon: Zap, path: '/automation', permission: 'automation' },
  { name: 'Settings', icon: Settings, path: '/settings', permission: 'settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const renderNav = () => (
    <nav className="flex-1 space-y-1.5 mt-8">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        if (!hasPermission(item.permission)) return null;

        return (
          <Link 
            key={item.path} 
            href={item.path}
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between p-3 rounded-2xl transition-luxury relative group ${
              isActive ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black hover:bg-gray-50/70'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <item.icon size={18} className={`transition-luxury ${isActive ? 'text-white' : 'group-hover:scale-110'}`} />
              <span className="text-xs font-black tracking-tight">{item.name}</span>
            </div>
            {isActive ? (
              <motion.div layoutId="active" className="w-1 h-3 bg-white rounded-full" />
            ) : (
              <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-luxury" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-6 right-6 z-[60]">
        <button onClick={toggle} className="p-3 bg-black text-white rounded-2xl shadow-2xl shadow-black/20">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden lg:flex w-72 h-full bg-white border-r border-gray-50 flex-col pt-10 pb-8 px-6 sticky top-0 shadow-premium">
        <Logo />
        {renderNav()}
        <UserSection user={user} logout={logout} />
      </div>

      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="lg:hidden fixed inset-0 z-50 bg-white p-10 flex flex-col pt-20"
          >
            <Logo />
            {renderNav()}
            <UserSection user={user} logout={logout} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3 px-4 group cursor-pointer">
      <div className="w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-luxury">
        <Zap size={20} fill="currentColor" />
      </div>
      <div>
        <h1 className="text-xl font-black text-black tracking-tighter leading-none mb-1">AdFlow.</h1>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest group-hover:text-black transition-colors">SaaS Ecosystem</p>
      </div>
    </div>
  );
}

function UserSection({ user, logout }: any) {
  return (
    <div className="mt-auto space-y-4">
      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3 group hover:border-black/5 transition-luxury cursor-pointer">
        <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-black text-xs text-gray-400 transition-luxury group-hover:bg-black group-hover:text-white">
          {user?.name[0] || 'A'}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-black text-black truncate">{user?.name || 'Account'}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{user?.role || 'Agent'}</p>
        </div>
      </div>
      <button 
        onClick={logout}
        className="w-full flex items-center gap-3.5 p-3 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50/50 transition-luxury font-black text-xs"
      >
        <LogOut size={18} />
        Logout Session
      </button>
    </div>
  );
}
