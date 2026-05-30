/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/layout.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles, Plus, MessageSquare, ChevronLeft, ChevronRight,
  Home, LogOut, Zap, Calendar, Link2, Building2, FileText, Globe
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

      {/* Sidebar */}
      <aside className={`flex flex-col flex-shrink-0 bg-[#161618] border-r border-white/[0.06] transition-all duration-300 ${
        collapsed ? 'w-14' : 'w-60'
      }`}>

        {/* Top — logo + collapse */}
        <div className={`flex items-center h-14 border-b border-white/[0.06] px-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
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
            className="w-7 h-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/80 transition-all"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* New Chat */}
        <div className="px-2 py-3">
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 text-indigo-300 hover:text-indigo-200 text-xs font-medium transition-all ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Plus size={14} />
            {!collapsed && 'Nouveau chat'}
          </button>
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-2 space-y-4" style={{ scrollbarWidth: 'none' }}>
          {!collapsed && Object.entries(groupedChats).map(([group, groupChats]) => (
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
                      className={`flex items-center gap-2.5 px-2 py-2 rounded-xl text-xs transition-all group ${
                        isActive
                          ? 'bg-white/[0.08] text-white'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                      }`}
                    >
                      <Icon size={13} className={`flex-shrink-0 ${color}`} />
                      <span className="truncate">{chat.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {collapsed && (
  <Link
    href="/ai/chat"
    className={`flex items-center justify-center w-9 h-9 mx-auto rounded-xl transition-all ${
      pathname === '/ai/chat' ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
    }`}
  >
    <MessageSquare size={14} className="text-white/40" />
  </Link>
)}
        </div>

        {/* Bottom — user + actions */}
        <div className={`border-t border-white/[0.06] p-2 space-y-1`}>
          {/* Home */}
          <Link
            href="/"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/[0.04] text-xs transition-all ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Home size={14} />
            {!collapsed && 'Accueil'}
          </Link>

          {/* Logout */}
          <Link
            href="/logout"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/[0.06] text-xs transition-all ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <LogOut size={14} />
            {!collapsed && 'Déconnexion'}
          </Link>

          {/* User initials */}
          <div className={`flex items-center gap-2.5 px-3 py-2 ${collapsed ? 'justify-center px-0' : ''}`}>
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">{initials}</span>
            </div>
            {!collapsed && (
              <span className="text-xs text-white/30 truncate">Mon compte</span>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}