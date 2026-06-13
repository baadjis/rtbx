// app/ai/settings/api-keys/ApiKeysClient.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Key, Plus, Copy, Check, Trash2, Loader2, Eye, EyeOff,
  Sparkles, Link2, Calendar, Building2, FileText, Globe, X
} from 'lucide-react';
import type { LangType } from '@/lib/lang/types';

type ApiKey = {
  id: string;
  name: string;
  agent_type: string;
  mode: string;
  daily_limit: number;
  requests_today: number;
  requests_total: number;
  last_used_at: string | null;
  created_at: string;
  is_active: boolean;
};

const AGENT_TYPES = [
  { id: 'all', label: 'Tous les agents', icon: Sparkles },
  { id: 'event', label: 'Événements', icon: Calendar },
  { id: 'shortener', label: 'Liens courts', icon: Link2 },
  { id: 'space', label: 'Spaces', icon: Globe },
  { id: 'business', label: 'Business', icon: Building2 },
  { id: 'form', label: 'Formulaires', icon: FileText },
];

const T = {
  fr: {
    title: 'Clés API',
    subtitle: 'Connectez vos agents RTBX à vos propres applications, sites ou bots.',
    new_key: 'Nouvelle clé',
    empty_title: 'Aucune clé API',
    empty_sub: 'Créez votre première clé pour commencer',
    name_label: 'Nom de la clé',
    name_ph: 'ex: Mon site événement',
    agent_label: 'Agent autorisé',
    limit_label: 'Limite quotidienne',
    create: 'Créer la clé',
    cancel: 'Annuler',
    creating: 'Création...',
    copy: 'Copier',
    copied: 'Copié',
    revoke: 'Révoquer',
    confirm_revoke: 'Révoquer cette clé ? Cette action est irréversible.',
    requests_today: "Aujourd'hui",
    requests_total: 'Total',
    daily_limit: 'Limite/jour',
    created: 'Créée le',
    never_used: 'Jamais utilisée',
    last_used: 'Dernière utilisation',
    new_key_created: 'Clé créée ! Copiez-la maintenant, elle ne sera plus affichée.',
    revoked: 'révoquée',
  },
  en: {
    title: 'API Keys',
    subtitle: 'Connect your RTBX agents to your own apps, sites, or bots.',
    new_key: 'New key',
    empty_title: 'No API keys',
    empty_sub: 'Create your first key to get started',
    name_label: 'Key name',
    name_ph: 'e.g: My event site',
    agent_label: 'Allowed agent',
    limit_label: 'Daily limit',
    create: 'Create key',
    cancel: 'Cancel',
    creating: 'Creating...',
    copy: 'Copy',
    copied: 'Copied',
    revoke: 'Revoke',
    confirm_revoke: 'Revoke this key? This action is irreversible.',
    requests_today: 'Today',
    requests_total: 'Total',
    daily_limit: 'Limit/day',
    created: 'Created',
    never_used: 'Never used',
    last_used: 'Last used',
    new_key_created: 'Key created! Copy it now, it will not be shown again.',
    revoked: 'revoked',
  },
};

function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white text-xs transition-all">
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      {copied ? copiedLabel : label}
    </button>
  );
}

export default function ApiKeysClient({ lang }: { lang: LangType }) {
  const t = T[lang];
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // Form state
  const [name, setName] = useState('');
  const [agentType, setAgentType] = useState('all');
  const [dailyLimit, setDailyLimit] = useState(100);

  const loadKeys = useCallback(async () => {
    try {
      const res = await fetch('/api/keys');
      const data = await res.json();
      setKeys(data.data ?? []);
    } catch {
      setKeys([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadKeys(); }, [loadKeys]);

  const createKey = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, agent_type: agentType, daily_limit: dailyLimit, mode: 'text' }),
      });
      const data = await res.json();
      if (data.success) {
        setNewKey(data.data.key);
        setName('');
        setAgentType('all');
        setDailyLimit(100);
        setShowForm(false);
        loadKeys();
      }
    } finally {
      setCreating(false);
    }
  };

  const revokeKey = async (id: string) => {
    if (!confirm(t.confirm_revoke)) return;
    await fetch(`/api/keys/${id}`, { method: 'DELETE' });
    loadKeys();
  };

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t.title}</h1>
          <p className="text-white/40 text-sm mt-1 max-w-md">{t.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-sm font-medium transition-all flex-shrink-0"
        >
          <Plus size={15} /> {t.new_key}
        </button>
      </div>

      {/* New key reveal */}
      {newKey && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
          <p className="text-emerald-400 text-sm font-medium">{t.new_key_created}</p>
          <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-2.5">
            <code className="flex-1 text-white text-xs font-mono truncate">{newKey}</code>
            <CopyButton text={newKey} label={t.copy} copiedLabel={t.copied} />
            <button onClick={() => setNewKey(null)} className="text-white/30 hover:text-white/60">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}>
          <div className="bg-[#1a1a1f] border border-white/[0.08] rounded-3xl p-6 w-full max-w-md space-y-4"
            onClick={e => e.stopPropagation()}>
            <h2 className="text-white font-semibold text-lg">{t.new_key}</h2>

            <div className="space-y-2">
              <label className="text-white/40 text-xs">{t.name_label}</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.name_ph}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/25 outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/40 text-xs">{t.agent_label}</label>
              <div className="grid grid-cols-2 gap-2">
                {AGENT_TYPES.map(agent => {
                  const Icon = agent.icon;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setAgentType(agent.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                        agentType === agent.id
                          ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                          : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:text-white/80'
                      }`}
                    >
                      <Icon size={13} /> {agent.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/40 text-xs">{t.limit_label}</label>
              <input
                type="number"
                value={dailyLimit}
                onChange={e => setDailyLimit(Number(e.target.value))}
                min={10}
                max={10000}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.09] rounded-xl text-white/60 text-sm font-medium transition-all"
              >
                {t.cancel}
              </button>
              <button
                onClick={createKey}
                disabled={creating || !name.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-white text-sm font-medium transition-all"
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : null}
                {creating ? t.creating : t.create}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keys list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={20} className="text-white/20 animate-spin" />
        </div>
      ) : keys.length === 0 ? (
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-10 text-center">
          <Key size={28} className="text-white/15 mx-auto mb-3" />
          <p className="text-white/50 text-sm font-medium">{t.empty_title}</p>
          <p className="text-white/25 text-xs mt-1">{t.empty_sub}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map(key => {
            const agent = AGENT_TYPES.find(a => a.id === key.agent_type) || AGENT_TYPES[0];
            const Icon = agent.icon;
            const usagePercent = Math.min((key.requests_today / key.daily_limit) * 100, 100);

            return (
              <div key={key.id}
                className={`bg-white/[0.04] border rounded-2xl p-4 space-y-3 ${
                  key.is_active ? 'border-white/[0.06]' : 'border-red-500/20 opacity-50'
                }`}>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{key.name}</p>
                      <p className="text-white/30 text-xs">{agent.label} · {t.created} {formatDate(key.created_at)}</p>
                    </div>
                  </div>

                  {key.is_active && (
                    <button
                      onClick={() => revokeKey(key.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium transition-all flex-shrink-0"
                    >
                      <Trash2 size={12} /> {t.revoke}
                    </button>
                  )}
                  {!key.is_active && (
                    <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                      {t.revoked}
                    </span>
                  )}
                </div>

                {/* Usage bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-white/30">
                    <span>{t.requests_today}: {key.requests_today} / {key.daily_limit}</span>
                    <span>{t.requests_total}: {key.requests_total}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>

                <p className="text-white/25 text-[10px]">
                  {key.last_used_at
                    ? `${t.last_used}: ${formatDate(key.last_used_at)}`
                    : t.never_used}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}