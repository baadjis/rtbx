// app/ai/settings/SettingsClient.tsx
'use client';
import Link from 'next/link';
import { Key, Send, ChevronRight, Sparkles, CreditCard } from 'lucide-react';
import type { LangType } from '@/lib/lang/types';

const T = {
  fr: {
    title: 'Paramètres',
    subtitle: 'Gérez vos clés API, intégrations et préférences pour RTBX AI.',
    api_keys: 'Clés API',
    api_keys_desc: 'Connectez vos agents à vos propres applications et sites.',
    integrations: 'Intégrations',
    integrations_desc: 'Telegram, WhatsApp et autres canaux de discussion.',
    billing: 'Facturation',
    billing_desc: 'Plans, utilisation et facturation.',
    coming_soon: 'Bientôt',
  },
  en: {
    title: 'Settings',
    subtitle: 'Manage your API keys, integrations and preferences for RTBX AI.',
    api_keys: 'API Keys',
    api_keys_desc: 'Connect your agents to your own apps and sites.',
    integrations: 'Integrations',
    integrations_desc: 'Telegram, WhatsApp and other chat channels.',
    billing: 'Billing',
    billing_desc: 'Plans, usage and billing.',
    coming_soon: 'Coming soon',
  },
};

export default function SettingsClient({ lang }: { lang: LangType }) {
  const t = T[lang];

  const sections = [
    {
      href: '/ai/settings/api-keys',
      icon: Key,
      title: t.api_keys,
      desc: t.api_keys_desc,
      color: 'from-indigo-500 to-violet-600',
      border: 'hover:border-indigo-500/30',
      available: true,
    },
    {
      href: '/ai/settings/integrations',
      icon: Send,
      title: t.integrations,
      desc: t.integrations_desc,
      color: 'from-blue-500 to-cyan-500',
      border: 'hover:border-blue-500/30',
      available: true,
    },
    {
      href: '/ai/settings/billing',
      icon: CreditCard,
      title: t.billing,
      desc: t.billing_desc,
      color: 'from-emerald-500 to-teal-500',
      border: 'hover:border-emerald-500/30',
      available: false,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t.title}</h1>
          <p className="text-white/40 text-sm mt-0.5">{t.subtitle}</p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {sections.map(section => {
          const Icon = section.icon;
          const content = (
            <div
              className={`flex items-center gap-4 bg-white/[0.04] border border-white/[0.06] ${section.border} rounded-2xl px-5 py-4 transition-all ${
                section.available ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-semibold">{section.title}</p>
                  {!section.available && (
                    <span className="text-[10px] text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full">
                      {t.coming_soon}
                    </span>
                  )}
                </div>
                <p className="text-white/35 text-xs mt-0.5">{section.desc}</p>
              </div>
              {section.available && (
                <ChevronRight size={16} className="text-white/20 flex-shrink-0" />
              )}
            </div>
          );

          return section.available ? (
            <Link key={section.href} href={section.href} className="block no-underline">
              {content}
            </Link>
          ) : (
            <div key={section.href}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}