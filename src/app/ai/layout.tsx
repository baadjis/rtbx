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
  Globe
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';

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

export default function AILayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { initials } = useUser();

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

    let group = 'Ancien';
    if (date.toDateString() === today.toDateString()) group = "Aujourd'hui";
    else if (date.toDateString() === yesterday.toDateString()) group = 'Hier';

    if (!acc[group]) acc[group] = [];
    acc[group].push(chat);
    return acc;
  }, {} as Record<string, ChatEntry[]>);

  return (
    <div className="flex h-screen bg-[#0f0f11] overflow-hidden">
      
      {/* Sidebar - Desktop + Mobile Top Drawer */}
      <aside className={`fixed md:relative inset-x-0 top-0 z-50 bg-[#161618] border-b md:border-r md:border-b-0 border-white/[0.06] 
        transition-all duration-300 flex flex-col
        ${mobileMenuOpen ? 'translate-y-0 h-[85vh]' : '-translate-y-full md:translate-y-0'}
        ${collapsed && !mobileMenuOpen ? 'md:w-14' : 'md:w-60'}`}>

        {/* Header */}
        <div className="flex items-center justify-between h-14 border-b border-white/[0.06] px-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">RTBX AI</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-white/60"
          >
            <X size={22} />
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-8 h-8 items-center justify-center text-white/40 hover:text-white"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-sm font-medium"
          >
            <Plus size={18} />
            Nouveau chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3 space-y-4 pb-20">
          {Object.entries(groupedChats).map(([group, groupChats]) => (
            <div key={group}>
              <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider px-2 mb-2">{group}</p>
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive ? 'bg-white/[0.08] text-white' : 'text-white/60 hover:bg-white/[0.05]'}`}
                    >
                      <Icon size={17} className={color} />
                      <span className="truncate">{chat.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden min-w-0 relative">
        {children}
      </main>

      {/* Mobile Top Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-11 h-11 bg-[#161618] border border-white/[0.1] rounded-2xl flex items-center justify-center text-white shadow-lg"
      >
        <Menu size={24} />
      </button>
    </div>
  );
}