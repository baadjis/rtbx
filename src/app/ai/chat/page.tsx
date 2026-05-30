/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai/chat/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, Sparkles, Link2, Building2, Calendar,
  FileText, Globe, MessageSquare, Trash2, ChevronRight
} from 'lucide-react';

const CONTEXT_ICONS: Record<string, any> = {
  general: Sparkles,
  shortener: Link2,
  business: Building2,
  event: Calendar,
  form: FileText,
  space: Globe,
};

const CONTEXT_COLORS: Record<string, string> = {
  general: 'from-indigo-500 to-violet-600',
  shortener: 'from-blue-500 to-cyan-500',
  business: 'from-amber-500 to-orange-500',
  event: 'from-emerald-500 to-teal-500',
  form: 'from-pink-500 to-rose-500',
  space: 'from-violet-500 to-purple-600',
};

const CONTEXT_LABELS: Record<string, string> = {
  general: 'Général',
  shortener: 'Liens courts',
  business: 'Business',
  event: 'Événements',
  form: 'Formulaires',
  space: 'Spaces',
};

type ChatEntry = {
  id: string;
  title: string;
  context: string;
  createdAt: string;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (date.toDateString() === yesterday.toDateString()) return 'Hier';
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export default function ChatListPage() {
const router = useRouter();

  // Initialisation lazy — pas de useEffect pour le chargement initial
const [chats, setChats] = useState<ChatEntry[]>(() => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('rtbx_chats') || '[]');
  } catch { return []; }
});

// useEffect seulement pour l'event listener
useEffect(() => {
  const reload = () => {
    try {
      setChats(JSON.parse(localStorage.getItem('rtbx_chats') || '[]'));
    } catch {}
  };
  window.addEventListener('rtbx_chats_updated', reload);
  return () => window.removeEventListener('rtbx_chats_updated', reload);
}, []);

  const deleteChat = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = chats.filter(c => c.id !== id);
    setChats(updated);
    localStorage.setItem('rtbx_chats', JSON.stringify(updated));
    localStorage.removeItem(`rtbx_chat_messages_${id}`);
    localStorage.removeItem(`rtbx_chat_context_${id}`);
    window.dispatchEvent(new Event('rtbx_chats_updated'));
  };

  // Grouper par date
  const grouped = chats.reduce((acc, chat) => {
    const date = new Date(chat.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let group = 'Plus ancien';
    if (date.toDateString() === today.toDateString()) group = "Aujourd'hui";
    else if (date.toDateString() === yesterday.toDateString()) group = 'Hier';
    else {
      const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) group = '7 derniers jours';
      else if (diffDays <= 30) group = '30 derniers jours';
    }

    if (!acc[group]) acc[group] = [];
    acc[group].push(chat);
    return acc;
  }, {} as Record<string, ChatEntry[]>);

  const groupOrder = ["Aujourd'hui", 'Hier', '7 derniers jours', '30 derniers jours', 'Plus ancien'];

  return (
    <div className="flex flex-col bg-[#0f0f11] min-h-full">

      {/* Header mobile */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </div>
          <h1 className="text-base font-semibold text-white tracking-tight">Mes chats</h1>
        </div>
        <button
          onClick={() => router.push('/ai')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 rounded-xl text-indigo-300 text-xs font-medium transition-all"
        >
          <Plus size={13} />
          Nouveau
        </button>
      </div>

      {/* Liste vide */}
      {chats.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 px-4 py-20 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <MessageSquare size={22} className="text-white/20" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-white/50 text-sm font-medium">Aucun chat pour le moment</p>
            <p className="text-white/25 text-xs">Commencez une nouvelle conversation</p>
          </div>
          <button
            onClick={() => router.push('/ai')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-sm font-medium transition-all"
          >
            <Plus size={14} />
            Nouveau chat
          </button>
        </div>
      )}

      {/* Liste groupée */}
      {chats.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {groupOrder
            .filter(group => grouped[group]?.length > 0)
            .map(group => (
              <div key={group}>
                <p className="text-[11px] text-white/25 font-medium uppercase tracking-wider mb-2 px-1">
                  {group}
                </p>
                <div className="space-y-1.5">
                  {grouped[group].map(chat => {
                    const Icon = CONTEXT_ICONS[chat.context] || MessageSquare;
                    const gradient = CONTEXT_COLORS[chat.context] || 'from-indigo-500 to-violet-600';
                    const label = CONTEXT_LABELS[chat.context] || 'Général';

                    return (
                      <Link
                        key={chat.id}
                        href={`/ai/chat/${chat.id}`}
                        className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.1] transition-all group"
                      >
                        {/* Icône contexte */}
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={15} className="text-white" />
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/90 font-medium truncate">
                            {chat.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-white/30">{label}</span>
                            <span className="text-white/15">·</span>
                            <span className="text-[11px] text-white/30">{formatDate(chat.createdAt)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => deleteChat(e, chat.id)}
                            className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                          <ChevronRight size={13} className="text-white/20" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}