// app/ai/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import {
  Link2, Building2, Calendar, FileText, Globe, Sparkles
} from 'lucide-react';
import { LangType } from '@/lib/lang/types';
import { Data } from '../../data';

const CONTEXTS = [
  {
    id: 'general',
    icon: Sparkles,
    labelKey: 'ai_context_general' as const,
    descriptionKey: 'ai_context_general_desc' as const,
    color: 'from-indigo-500 to-violet-600',
    border: 'border-indigo-500/20 hover:border-indigo-500/40',
    bg: 'hover:bg-indigo-500/5',
  },
  {
    id: 'shortener',
    icon: Link2,
    labelKey: 'ai_context_shortener' as const,
    descriptionKey: 'ai_context_shortener_desc' as const,
    color: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    bg: 'hover:bg-blue-500/5',
  },
  {
    id: 'business',
    icon: Building2,
    labelKey: 'ai_context_business' as const,
    descriptionKey: 'ai_context_business_desc' as const,
    color: 'from-amber-500 to-orange-500',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    bg: 'hover:bg-amber-500/5',
  },
  {
    id: 'event',
    icon: Calendar,
    labelKey: 'ai_context_event' as const,
    descriptionKey: 'ai_context_event_desc' as const,
    color: 'from-emerald-500 to-teal-500',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    bg: 'hover:bg-emerald-500/5',
  },
  {
    id: 'form',
    icon: FileText,
    labelKey: 'ai_context_form' as const,
    descriptionKey: 'ai_context_form_desc' as const,
    color: 'from-pink-500 to-rose-500',
    border: 'border-pink-500/20 hover:border-pink-500/40',
    bg: 'hover:bg-pink-500/5',
  },
  {
    id: 'space',
    icon: Globe,
    labelKey: 'ai_context_space' as const,
    descriptionKey: 'ai_context_space_desc' as const,
    color: 'from-violet-500 to-purple-600',
    border: 'border-violet-500/20 hover:border-violet-500/40',
    bg: 'hover:bg-violet-500/5',
  },
] as const;

export default function AIPageClient({ lang }: { lang: LangType }) {
  const t = Data[lang];
  const router = useRouter();

  const handleContextSelect = (contextId: string) => {
    const id = crypto.randomUUID();
    const chats = JSON.parse(localStorage.getItem('rtbx_chats') || '[]');
    
    chats.unshift({
      id,
      title: t.ai_new_chat|| 'Nouveau chat',
      context: contextId,
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem('rtbx_chats', JSON.stringify(chats.slice(0, 50)));
    localStorage.setItem(`rtbx_chat_context_${id}`, contextId);

    window.dispatchEvent(new Event('rtbx_chats_updated'));
    router.push(`/ai/chat/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0f0f11] px-4">
      <div className="w-full max-w-lg space-y-8">
        
        {/* Header */}
<div className="text-center space-y-3">
  <div className="flex items-center justify-center gap-3 mx-auto">
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
      <Sparkles size={24} className="text-white" />
    </div>
    <h1 className="text-4xl font-black tracking-tighter text-white">
      RTBX AI
    </h1>
  </div>
  
  <p className="text-white/40 text-sm max-w-xs mx-auto">
    {t.ai_choose_context || "Choisissez un contexte pour commencer"}
  </p>
</div>

        {/* Context grid */}
        <div className="grid grid-cols-2 gap-3">
          {CONTEXTS.map(ctx => {
            const Icon = ctx.icon;
            return (
              <button
                key={ctx.id}
                onClick={() => handleContextSelect(ctx.id)}
                className={`flex items-start gap-3 p-4 rounded-2xl border bg-white/[0.02] ${ctx.border} ${ctx.bg} text-left transition-all active:scale-95`}
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${ctx.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">{t[ctx.labelKey]}</p>
                  <p className="text-xs text-white/35 mt-0.5 leading-relaxed">{t[ctx.descriptionKey]}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}