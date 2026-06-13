/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/layout.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles, Plus, MessageSquare, ChevronLeft, ChevronRight,
  Home, LogOut, Menu, X,
  Link2,
  Building2,
  Calendar,
  FileText,
  Globe,
  Settings
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { LangType } from '@/lib/lang/types';

const CONTEXT_ICONS: Record<string, any> = {
  general: Sparkles,
  shortener: Link2,
  business: Building2,
  event: Calendar,
  form: FileText,
  space: Globe,
};

const CONTEXT_COLORS: Record<string, string> = {
  general: 'text-indigo-400',
  shortener: 'text-blue-400',
  business: 'text-amber-400',
  event: 'text-emerald-400',
  form: 'text-pink-400',
  space: 'text-violet-400',
};

type ChatEntry = {
  id: string;
  title: string;
  context: string;
  createdAt: string;
};

const Data={
    fr:{ 
      mcp_my_account:"Mon compte",
      ai_today:"Aujourd'hui",
      ai_yesterday:"Hier",
      ai_old_chats:"Ancien",
      ai_new_chat:"Nouveau chat",
      ai_home:"Accueil",
      ai_logout:"Déconnexion",
      ai_settings:"Paramètres"

    

    },
    en:{ 
      mcp_my_account:"Account",
      ai_today:"Today",
      ai_yesterday:"Yesterday",
      ai_old_chats:"Older",
      ai_new_chat:"New Chat",
      ai_home:"Home",
      ai_logout:"Logout",
      ai_settings:"Settings"
    }
}

export default function AILayoutClient({ children ,lang}: { children: React.ReactNode , lang:LangType}) {
const [collapsed, setCollapsed] = useState(false);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const router = useRouter();
const pathname = usePathname();
const { initials } = useUser();
const t = Data[lang||'en' ]// traduction par défaut

// Récupérer la langue au chargement


const [chats, setChats] = useState<ChatEntry[]>(() => {
if (typeof window === 'undefined') return [];
try {
return JSON.parse(localStorage.getItem('rtbx_chats') || '[]');
    } catch { return []; }
  });

const reloadChats = useCallback(() => {
try {
setChats(JSON.parse(localStorage.getItem('rtbx_chats') || '[]'));
    } catch {}
  }, []);

useEffect(() => {
    window.addEventListener('rtbx_chats_updated', reloadChats);
return () => window.removeEventListener('rtbx_chats_updated', reloadChats);
  }, [reloadChats]);

const handleNewChat = () => {
setMobileMenuOpen(false);
    router.push('/ai');
  };

const groupedChats = chats.reduce((acc, chat) => {
const date = new Date(chat.createdAt);
const today = new Date();
const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
let group = t.ai_old_chats;
if (date.toDateString() === today.toDateString()) group = t.ai_today;
else if (date.toDateString() === yesterday.toDateString()) group = t.ai_yesterday;
if (!acc[group]) acc[group] = [];
    acc[group].push(chat);
return acc;
  }, {} as Record<string, ChatEntry[]>);

return (
<div className="flex h-screen bg-[#0f0f11] overflow-hidden">
      {/* Sidebar */}
<aside className={`fixed md:relative inset-x-0 top-0 z-50 bg-[#161618] border-b md:border-r md:border-b-0 border-white/[0.06]
        transition-all duration-300 flex flex-col
${mobileMenuOpen ? 'translate-y-0 h-[88vh]' : '-translate-y-full md:translate-y-0'}
${collapsed && !mobileMenuOpen ? 'md:w-20' : 'md:w-80'}`}>
        {/* Header */}
<div className="flex items-center h-14 border-b border-white/[0.06] px-3">
          {!collapsed && (
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
<Sparkles size={12} className="text-white" />
</div>
<span className="text-sm font-semibold text-white tracking-tight">RTBX AI</span>
</div>
          )}
<button
onClick={() => setCollapsed(!collapsed)}
className="hidden md:block ml-auto w-8 h-8 flex items-center justify-center text-white/40 hover:text-white"
>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
</button>
<button
onClick={() => setMobileMenuOpen(false)}
className="md:hidden ml-auto w-8 h-8 flex items-center justify-center text-white/60"
>
<X size={22} />
</button>
</div>
        {/* New Chat */}
<div className="px-3 py-3">
<button
onClick={handleNewChat}
className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 text-indigo-300 hover:text-indigo-200 text-sm font-medium transition-all ${collapsed && !mobileMenuOpen ? 'justify-center' : ''}`}
>
<Plus size={20} />
            {!collapsed && t.ai_new_chat}
</button>
</div>
        {/* Chat History */}
<div className="flex-1 overflow-y-auto px-2 space-y-4">
          {collapsed ? (
<Link
href="/ai/chat"
className={`flex items-center justify-center w-10 h-10 mx-auto mt-6 rounded-2xl transition-all ${
pathname.startsWith('/ai/chat') ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
}`}
>
<MessageSquare size={20} className="text-white/40" />
</Link>
          ) : (
            Object.entries(groupedChats).map(([group, groupChats]) => (
<div key={group}>
<p className="text-[10px] text-white/25 font-medium uppercase tracking-wider px-2 mb-1">{group}</p>
<div className="space-y-0.5">
                  {groupChats.map(chat => {
const Icon = CONTEXT_ICONS[chat.context] || MessageSquare;
const color = CONTEXT_COLORS[chat.context] || 'text-white/40';
const isActive = pathname === `/ai/chat/${chat.id}`;
return (
<Link
key={chat.id}
href={`/ai/chat/${chat.id}`}
onClick={() => setMobileMenuOpen(false)}
className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all group ${isActive ? 'bg-white/[0.08] text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'}`}
>
<Icon size={20} className={`flex-shrink-0 ${color}`} />
<span className="truncate">{chat.title}</span>
</Link>
                    );
                  })}
</div>
</div>
            ))
          )}
</div>
        {/* Bottom Section */}
<div className="border-t border-white/[0.06] p-3 space-y-1">
<Link
href="/"
className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.04] text-sm transition-all ${collapsed && !mobileMenuOpen ? 'justify-center' : ''}`}
>
<Home size={20} />
            {!collapsed && t.ai_home}
</Link>

<Link href="/settings" 
className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.04] text-sm transition-all ${collapsed && !mobileMenuOpen ? 'justify-center' : ''}`}

>
  <Settings size={14} />
  {!collapsed && t.ai_settings}
</Link>

<form action="/auth/signout" method="post">
<button type='submit'
className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/[0.06] text-sm transition-all ${collapsed && !mobileMenuOpen ? 'justify-center' : ''}`}
>
<LogOut size={20} />
            {!collapsed && t.ai_logout}
</button>
          
</form>

<div className={`flex items-center gap-2.5 px-3 py-2 ${collapsed && !mobileMenuOpen ? 'justify-center' : ''}`}>
<div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
<span className="text-[10px] font-bold text-white">{initials}</span>
</div>
            {!collapsed && <span className="text-xs text-white/30">{t.mcp_my_account}</span>}
</div>
</div>
</aside>
      {/* Main Content */}
<main className="flex-1 overflow-hidden min-w-0">
        {children}
</main>
      {/* Mobile Burger Button */}
<button
onClick={() => setMobileMenuOpen(true)}
className="md:hidden fixed top-4 left-4 z-50 w-11 h-11 bg-[#161618] border border-white/[0.1] rounded-2xl flex items-center justify-center text-white shadow-xl"
>
<Menu size={24} />
</button>
</div>
  );
}