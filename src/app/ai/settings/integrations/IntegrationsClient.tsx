/* eslint-disable @typescript-eslint/no-explicit-any */

// app/ai/settings/integrations/IntegrationsClient.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Send, Plus, Trash2, Loader2, ExternalLink, CheckCircle2,
  User, Globe, Calendar, Building2, ChevronRight, Info, X
} from 'lucide-react';
import type { LangType } from '@/lib/lang/types';

type TelegramConfig = {
  id: string;
  chat_id: string;
  agent_type: string;
  context_id: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
};

type Entity = { id: string; title?: string; name?: string; slug?: string };

const T = {
  fr: {
    title: 'Intégrations',
    subtitle: 'Connectez vos agents RTBX à Telegram et discutez avec eux depuis votre téléphone.',
    telegram_title: 'Telegram',
    telegram_desc: 'Recevez et gérez vos événements, liens, formulaires directement depuis Telegram.',
    connect: 'Connecter un chat',
    empty_title: 'Aucun chat connecté',
    empty_sub: 'Connectez votre premier chat Telegram',
    step1_title: '1. Trouvez votre Chat ID',
    step1_desc: 'Ouvrez Telegram, cherchez',
    step1_link: '@userinfobot',
    step1_after: 'et démarrez une conversation. Il vous donnera votre Chat ID.',
    step2_title: '2. Type d\'assistant',
    type_personal: 'Assistant personnel',
    type_personal_desc: 'Gère tous vos événements, liens, formulaires, business et spaces.',
    type_public: 'Assistant public',
    type_public_desc: 'Répond aux questions des visiteurs sur un événement ou business spécifique.',
    step3_title: '3. Choisir l\'entité',
    select_entity: 'Sélectionner...',
    chat_id_label: 'Chat ID',
    chat_id_ph: 'ex: 123456789',
    connect_btn: 'Connecter',
    connecting: 'Connexion...',
    cancel: 'Annuler',
    active: 'Actif',
    disconnect: 'Déconnecter',
    confirm_disconnect: 'Déconnecter ce chat ?',
    personal: 'Personnel',
    public: 'Public',
    chat: 'Chat',
    bot_link: 'Ouvrir le bot',
    type_event: 'Événement',
    type_business: 'Business',
    loading_entities: 'Chargement...',
    no_entities: 'Aucune entité disponible. Créez-en une depuis le chat AI général.',
  },
  en: {
    title: 'Integrations',
    subtitle: 'Connect your RTBX agents to Telegram and chat with them from your phone.',
    telegram_title: 'Telegram',
    telegram_desc: 'Manage your events, links, forms directly from Telegram.',
    connect: 'Connect a chat',
    empty_title: 'No chat connected',
    empty_sub: 'Connect your first Telegram chat',
    step1_title: '1. Find your Chat ID',
    step1_desc: 'Open Telegram, search for',
    step1_link: '@userinfobot',
    step1_after: 'and start a conversation. It will give you your Chat ID.',
    step2_title: '2. Assistant type',
    type_personal: 'Personal assistant',
    type_personal_desc: 'Manages all your events, links, forms, business and spaces.',
    type_public: 'Public assistant',
    type_public_desc: 'Answers visitor questions about a specific event or business.',
    step3_title: '3. Select entity',
    select_entity: 'Select...',
    chat_id_label: 'Chat ID',
    chat_id_ph: 'e.g: 123456789',
    connect_btn: 'Connect',
    connecting: 'Connecting...',
    cancel: 'Cancel',
    active: 'Active',
    disconnect: 'Disconnect',
    confirm_disconnect: 'Disconnect this chat?',
    personal: 'Personal',
    public: 'Public',
    chat: 'Chat',
    bot_link: 'Open bot',
    type_event: 'Event',
    type_business: 'Business',
    loading_entities: 'Loading...',
    no_entities: 'No entities available. Create one from the general AI chat first.',
  },
};

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'rtbx_bot';

export default function IntegrationsClient({ lang }: { lang: LangType }) {
  const t = T[lang];
  const [configs, setConfigs] = useState<TelegramConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Form state
  const [chatId, setChatId] = useState('');
  const [assistantType, setAssistantType] = useState<'personal' | 'public'>('personal');
  const [publicEntityType, setPublicEntityType] = useState<'event' | 'business'>('event');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState('');

  const loadConfigs = useCallback(async () => {
    try {
      const res = await fetch('/api/integrations/telegram');
      const data = await res.json();
      setConfigs(data.data ?? []);
    } catch {
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadConfigs(); }, [loadConfigs]);

  // Charger les entités quand on choisit public + type
  useEffect(() => {
    if (assistantType !== 'public') return;
    setLoadingEntities(true);
    setSelectedEntityId('');

    const endpoint = publicEntityType === 'event' ? '/api/events/me' : '/api/businesses/me';
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        let items: any[] = [];
        if (publicEntityType === 'event') {
          items = data.data?.organized ?? [];
        } else {
          items = data.data ?? [];
        }
        setEntities(items);
      })
      .catch(() => setEntities([]))
      .finally(() => setLoadingEntities(false));
  }, [assistantType, publicEntityType]);

  const connect = async () => {
    if (!chatId.trim()) return;
    if (assistantType === 'public' && !selectedEntityId) return;

    setConnecting(true);
    try {
      const res = await fetch('/api/integrations/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId.trim(),
          agent_type: assistantType === 'personal' ? 'general' : publicEntityType,
          context_id: assistantType === 'public' ? selectedEntityId : null,
          role: assistantType === 'personal' ? 'owner' : 'visitor',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setChatId('');
        setAssistantType('personal');
        setSelectedEntityId('');
        loadConfigs();
      }
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async (id: string) => {
    if (!confirm(t.confirm_disconnect)) return;
    await fetch(`/api/integrations/telegram/${id}`, { method: 'DELETE' });
    loadConfigs();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{t.title}</h1>
        <p className="text-white/40 text-sm mt-1 max-w-md">{t.subtitle}</p>
      </div>

      {/* Telegram section */}
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Send size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{t.telegram_title}</p>
              <p className="text-white/30 text-xs">{t.telegram_desc}</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-xs font-medium transition-all flex-shrink-0"
          >
            <Plus size={14} /> {t.connect}
          </button>
        </div>

        {/* Connected chats */}
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 size={18} className="text-white/20 animate-spin" />
          </div>
        ) : configs.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-white/[0.08] rounded-2xl">
            <Send size={20} className="text-white/15 mx-auto mb-2" />
            <p className="text-white/40 text-xs font-medium">{t.empty_title}</p>
            <p className="text-white/20 text-[11px] mt-0.5">{t.empty_sub}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {configs.map(config => (
              <div key={config.id}
                className="flex items-center justify-between gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                    {config.role === 'visitor'
                      ? <Globe size={14} className="text-violet-400" />
                      : <User size={14} className="text-indigo-400" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{t.chat} {config.chat_id}</p>
                      {config.is_active && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                          <CheckCircle2 size={10} /> {t.active}
                        </span>
                      )}
                    </div>
                    <p className="text-white/30 text-xs">
                      {config.role === 'visitor'
                        ? `${t.public} · ${config.agent_type === 'event' ? t.type_event : t.type_business}`
                        : t.personal}
                      {' · '}{formatDate(config.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => disconnect(config.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <a
          href={`https://t.me/${BOT_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors"
        >
          <ExternalLink size={12} /> {t.bot_link}
        </a>
      </div>

      {/* Connect modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}>
          <div className="bg-[#1a1a1f] border border-white/[0.08] rounded-3xl p-6 w-full max-w-md space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg">{t.connect}</h2>
              <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white/60">
                <X size={16} />
              </button>
            </div>

            {/* Step 1 — Chat ID */}
            <div className="space-y-2">
              <p className="text-white/70 text-xs font-medium">{t.step1_title}</p>
              <div className="flex items-start gap-2 bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3">
                <Info size={13} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/50 text-xs leading-relaxed">
                  {t.step1_desc}{' '}
                  <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer"
                    className="text-indigo-400 font-medium hover:underline">
                    {t.step1_link}
                  </a>
                  {' '}{t.step1_after}
                </p>
              </div>
              <input
                value={chatId}
                onChange={e => setChatId(e.target.value)}
                placeholder={t.chat_id_ph}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/25 outline-none focus:border-indigo-500/50 font-mono"
              />
            </div>

            {/* Step 2 — Type */}
            <div className="space-y-2">
              <p className="text-white/70 text-xs font-medium">{t.step2_title}</p>
              <div className="space-y-2">
                <button
                  onClick={() => setAssistantType('personal')}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    assistantType === 'personal'
                      ? 'bg-indigo-500/10 border-indigo-500/30'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]'
                  }`}
                >
                  <User size={16} className={assistantType === 'personal' ? 'text-indigo-400' : 'text-white/30'} />
                  <div>
                    <p className={`text-sm font-medium ${assistantType === 'personal' ? 'text-white' : 'text-white/70'}`}>
                      {t.type_personal}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">{t.type_personal_desc}</p>
                  </div>
                </button>

                <button
                  onClick={() => setAssistantType('public')}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    assistantType === 'public'
                      ? 'bg-violet-500/10 border-violet-500/30'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]'
                  }`}
                >
                  <Globe size={16} className={assistantType === 'public' ? 'text-violet-400' : 'text-white/30'} />
                  <div>
                    <p className={`text-sm font-medium ${assistantType === 'public' ? 'text-white' : 'text-white/70'}`}>
                      {t.type_public}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">{t.type_public_desc}</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 3 — Entity selection (only for public) */}
            {assistantType === 'public' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <p className="text-white/70 text-xs font-medium">{t.step3_title}</p>

                {/* Entity type toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPublicEntityType('event')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      publicEntityType === 'event'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-white/[0.02] border-white/[0.06] text-white/40'
                    }`}
                  >
                    <Calendar size={12} /> {t.type_event}
                  </button>
                  <button
                    onClick={() => setPublicEntityType('business')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      publicEntityType === 'business'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-white/[0.02] border-white/[0.06] text-white/40'
                    }`}
                  >
                    <Building2 size={12} /> {t.type_business}
                  </button>
                </div>

                {/* Entity select */}
                {loadingEntities ? (
                  <div className="flex items-center gap-2 text-white/30 text-xs py-2">
                    <Loader2 size={12} className="animate-spin" /> {t.loading_entities}
                  </div>
                ) : entities.length === 0 ? (
                  <p className="text-white/25 text-xs py-2">{t.no_entities}</p>
                ) : (
                  <select
                    value={selectedEntityId}
                    onChange={e => setSelectedEntityId(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-indigo-500/50"
                  >
                    <option value="">{t.select_entity}</option>
                    {entities.map(entity => (
                      <option key={entity.id} value={entity.id}>
                        {entity.title || entity.name || entity.slug}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.09] rounded-xl text-white/60 text-sm font-medium transition-all"
              >
                {t.cancel}
              </button>
              <button
                onClick={connect}
                disabled={connecting || !chatId.trim() || (assistantType === 'public' && !selectedEntityId)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-white text-sm font-medium transition-all"
              >
                {connecting ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                {connecting ? t.connecting : t.connect_btn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}