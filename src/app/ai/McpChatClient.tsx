/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Bot, CheckCircle, XCircle, Zap } from 'lucide-react';
import type { LangType } from '@/lib/lang/types';
import { Data } from './data';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  isConfirmation?: boolean;
  pendingAction?: any;
};

const MAX_HISTORY = 10;

const CONTEXT_SUGGESTIONS: Record<string, string[][]> = {
  general: [
    ['mcp_suggestion_create_space', 'mcp_suggestion_create_business'],
    ['mcp_suggestion_create_short_link', 'mcp_suggestion_ideas'],
  ],
  space: [
    ['mcp_suggestion_update_space', 'mcp_suggestion_change_theme'],
    ['mcp_suggestion_add_social'],
  ],
  business: [
    ['mcp_suggestion_add_contact', 'mcp_suggestion_update_address'],
    ['mcp_suggestion_add_logo'],
  ],
  shortener: [
    ['mcp_suggestion_create_another_link', 'mcp_suggestion_view_my_links'],
    ['mcp_suggestion_view_link_stats'],
  ],
  event: [
    ['mcp_suggestion_create_event', 'mcp_suggestion_view_my_events'],
    ['mcp_suggestion_send_invites'],
  ],
  form: [
    ['mcp_suggestion_create_form', 'mcp_suggestion_view_my_forms'],
  ],
};

export default function MCPChatClient({ lang }: { lang: LangType }) {
  const t = Data[lang];

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.mcp_welcome }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<any>(null);
  const [currentContext, setCurrentContext] = useState<string>('general');
  const [inputFocused, setInputFocused] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const buildContextMessages = (allMessages: Message[], extraMessage?: Message) => {
    const full = extraMessage ? [...allMessages, extraMessage] : allMessages;
    return full
      .slice(-MAX_HISTORY)
      .map(({ role, content }) => ({ role, content }));
  };

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const detectContext = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.match(/space|profil|slug|identit/)) return 'space';
    if (lower.match(/business|entreprise|société|compan/)) return 'business';
    if (lower.match(/lien|link|short|url|raccourci/)) return 'shortener';
    if (lower.match(/event|événement|agenda|badge|invit/)) return 'event';
    if (lower.match(/form|formulaire|sondage|survey|réponse/)) return 'form';
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/mcp/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: buildContextMessages(messages, userMessage),
          lang,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: errData.text || t.mcp_rate_limit || '⏳ Limite atteinte. Réessayez dans quelques secondes.',
          }]);
          return;
        }
        throw new Error(errData.error || 'Server error');
      }

      const data = await response.json();

      const newMessage: Message = {
        role: 'assistant',
        content: data.text || t.mcp_error || "Désolé, je n'ai pas pu répondre.",
        isConfirmation: data.requiresConfirmation || false,
        pendingAction: data.pendingAction || null,
      };

      setMessages(prev => [...prev, newMessage]);
      setPendingConfirmation(newMessage.isConfirmation ? newMessage.pendingAction : null);

      const ctx = detectContext(data.text || '');
      if (ctx) setCurrentContext(ctx);

    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t.mcp_error || 'Erreur de connexion. Veuillez réessayer.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmation = async (confirmed: boolean) => {
    if (!pendingConfirmation) return;
    setIsLoading(true);

    const userResponse = confirmed ? 'Oui, confirme et procède.' : 'Non, annule.';
    const confirmMessage: Message = { role: 'user', content: userResponse };
    setMessages(prev => [...prev, confirmMessage]);

    try {
      const response = await fetch('/mcp/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: buildContextMessages(messages, confirmMessage),
          lang,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: errData.text || t.mcp_rate_limit || '⏳ Limite atteinte.',
          }]);
          return;
        }
        throw new Error(errData.error || 'Server error');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.text || 'Action effectuée.',
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Erreur lors de la confirmation.',
      }]);
    } finally {
      setPendingConfirmation(null);
      setIsLoading(false);
    }
  };

  const suggestions = (CONTEXT_SUGGESTIONS[currentContext] || CONTEXT_SUGGESTIONS.general)
    .flat()
    .map(key => (t as any)[key])
    .filter(Boolean);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col bg-[#0f0f11]" style={{ height: '100dvh' }}>

      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
          <Sparkles size={15} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white tracking-tight">RTBX Assistant</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-white/40">En ligne</span>
          </div>
        </div>
      </div>

      {/* Messages — scroll naturel */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

              {/* Avatar assistant */}
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={14} className="text-white" />
                </div>
              )}

              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-white/[0.06] text-white/90 rounded-tl-sm border border-white/[0.06]'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Boutons confirmation */}
                {msg.isConfirmation && (
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => handleConfirmation(true)}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-medium transition-all disabled:opacity-50"
                    >
                      <CheckCircle size={14} />
                      Confirmer
                    </button>
                    <button
                      onClick={() => handleConfirmation(false)}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-xl text-red-400 text-xs font-medium transition-all disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  {[0, 150, 300].map(delay => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Suggestions + Input — fixé en bas */}
      <div className="flex-shrink-0 border-t border-white/[0.06] bg-[#0f0f11]">

        {/* Suggestions */}
        {suggestions.length > 0 && !isLoading && (
          <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {suggestions.slice(0, 4).map((suggestion, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(suggestion);
                  inputRef.current?.focus();
                }}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-full text-white/60 hover:text-white/90 text-xs transition-all"
              >
                <Zap size={10} className="text-indigo-400" />
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="px-4 pb-4 pt-2">
          <div className={`flex items-end gap-2 bg-white/[0.05] border rounded-2xl px-4 py-3 transition-all ${
            inputFocused ? 'border-indigo-500/50 bg-white/[0.07]' : 'border-white/[0.08]'
          }`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder={t.mcp_placeholder || 'Demandez quelque chose...'}
              disabled={isLoading}
              rows={1}
              className="flex-1 bg-transparent text-white/90 text-sm placeholder:text-white/25 resize-none outline-none leading-relaxed disabled:opacity-50"
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/[0.06] disabled:text-white/20 text-white flex items-center justify-center transition-all active:scale-95"
            >
              <Send size={14} />
            </button>
          </div>
          <p className="text-center text-[10px] text-white/20 mt-2">
             {t.mcp_input_hint}
          </p>
        </div>
      </div>
    </div>
  );
}