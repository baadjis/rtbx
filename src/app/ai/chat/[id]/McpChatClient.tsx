/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Bot, CheckCircle, XCircle, Zap } from 'lucide-react';
import type { LangType } from '@/lib/lang/types';
import { Data } from '../../data';
import MCPUIRenderer from '../../components/MCPUIRenderer';
import MessageActions, { UserMessageActions } from '../../components/MessageAction';
//import MCPUIRenderer from '../components/MCPUIRenderer';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  isConfirmation?: boolean;
  ui?: { type: string; data: any } | null;
  pendingAction?: any;
  suggestions?:any[]
};

const MAX_HISTORY = 10;

const CONTEXT_SUGGESTIONS: Record<string, string[]> = {
  general: [
    'mcp_suggestion_create_space',
    'mcp_suggestion_create_business',
    'mcp_suggestion_create_short_link',
    'mcp_suggestion_create_form',
  ],
  space: [
    'mcp_suggestion_update_space',
    'mcp_suggestion_change_theme',
    'mcp_suggestion_add_social',
  ],
  business: [
    'mcp_suggestion_add_contact',
    'mcp_suggestion_update_address',
    'mcp_suggestion_add_logo',
    'mcp_suggestion_view_my_businesses',
    'mcp_suggestion_add_provider_link',
    'mcp_suggestion_setup_loyalty',
   'mcp_suggestion_view_opening_hours',
  ],
  shortener: [
    'mcp_suggestion_create_another_link',
    'mcp_suggestion_view_my_links',
    'mcp_suggestion_view_link_stats',
  ],
  event: [
    'mcp_suggestion_create_event',
    'mcp_suggestion_view_my_events',
    'mcp_suggestion_send_invites',
  ],
  form: [
    'mcp_suggestion_create_form',
    'mcp_suggestion_view_my_forms',
  ],
};

const detectContextFromTools = (toolNames: string[]): string | null => {
  if (toolNames.some(name => /Short|Link|Shortener/i.test(name))) return 'shortener';
  if (toolNames.some(name => /Space/i.test(name))) return 'space';
  if (toolNames.some(name => /Business/i.test(name))) return 'business';
  if (toolNames.some(name => /Event|Agenda|Badge|Invite/i.test(name))) return 'event';
  if (toolNames.some(name => /Form/i.test(name))) return 'form';
  return null;
};

export default function MCPChatClient({
  lang,
  chatId,
  
}: {
  lang: LangType;
  chatId?: string;
}) {
  const t = Data[lang];

const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [pendingConfirmation, setPendingConfirmation] = useState<any>(null);
const [currentContext, setCurrentContext] = useState<string>('general');
const [entityId, setEntityId] = useState<string | null>(null); // ← nouveau
const [inputFocused, setInputFocused] = useState(false);
const [pendingTool, setPendingTool] = useState<string | null>(null);

const chatEndRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLTextAreaElement>(null);
const messagesContainerRef = useRef<HTMLDivElement>(null);

const isEmptyChat = messages.length === 0;

useEffect(() => {
  if (!chatId) return;
  const savedMessages = localStorage.getItem(`rtbx_chat_messages_${chatId}`);
  if (savedMessages) {
    try { setMessages(JSON.parse(savedMessages)); } catch {}
  }
  const savedContext = localStorage.getItem(`rtbx_chat_context_${chatId}`);
  if (savedContext) setCurrentContext(savedContext);
  const savedEntityId = localStorage.getItem(`rtbx_chat_entity_${chatId}`); // ← nouveau
  if (savedEntityId) setEntityId(savedEntityId); // ← nouveau
}, [chatId]);

const saveMessages = useCallback((msgs: Message[]) => {
  if (!chatId) return;
  localStorage.setItem(`rtbx_chat_messages_${chatId}`, JSON.stringify(msgs));
}, [chatId]);

const updateChatTitle = useCallback((firstUserMessage: string) => {
  if (!chatId) return;
  const chats = JSON.parse(localStorage.getItem('rtbx_chats') || '[]');
  const updated = chats.map((c: any) =>
    c.id === chatId ? { ...c, title: firstUserMessage.slice(0, 40) } : c
  );
  localStorage.setItem('rtbx_chats', JSON.stringify(updated));
  window.dispatchEvent(new Event('rtbx_chats_updated'));
}, [chatId]);

const updateChatContext = useCallback((ctx: string) => {
  if (!chatId) return;
  localStorage.setItem(`rtbx_chat_context_${chatId}`, ctx);
  const chats = JSON.parse(localStorage.getItem('rtbx_chats') || '[]');
  const updated = chats.map((c: any) =>
    c.id === chatId ? { ...c, context: ctx } : c
  );
  localStorage.setItem('rtbx_chats', JSON.stringify(updated));
}, [chatId]);

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

useEffect(() => {
  if (inputRef.current) {
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
  }
}, [input]);

const getAgentEndpoint = (context: string): string => {
  switch (context) {
    case 'event': return '/api/agents/event';
    case 'shortener': return '/api/agents/shortener';
    case 'space': return '/api/agents/space';
    case 'business': return '/api/agents/business'; 
    default: return '/mcp/server';
  }
};

// Body commun pour tous les fetches
const buildRequestBody = (msgs: Message[], pTool?: string | null) => ({
  messages: msgs,
  lang,
  ...(currentContext === 'event' && entityId ? { eventId: entityId } : {}),
  ...(currentContext === 'space' && entityId ? { spaceId: entityId } : {}),
  ...(currentContext === 'form' && entityId ? { formId: entityId } : {}),
  ...(currentContext === 'business' && entityId ? { businessId: entityId } : {}),
  ...(pTool ? { pendingTool: pTool } : {}),
});

const sendMessage = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage: Message = { role: 'user', content: input };
  const newMessages = [...messages, userMessage];

  setMessages(newMessages);
  saveMessages(newMessages);

  if (messages.length === 0) updateChatTitle(input);

  setInput('');
  setIsLoading(true);

  try {
    const response = await fetch(getAgentEndpoint(currentContext), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildRequestBody(buildContextMessages(messages, userMessage))),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      if (response.status === 429) {
        const updated = [...newMessages, {
          role: 'assistant' as const,
          content: errData.text || t.mcp_rate_limit || '⏳ Limite atteinte. Réessayez dans quelques secondes.',
        }];
        setMessages(updated);
        saveMessages(updated);
        return;
      }
      throw new Error(errData.error || 'Server error');
    }

    const data = await response.json();
    if (data.pendingTool) setPendingTool(data.pendingTool);
     else setPendingTool(null);

    const toolNames: string[] = data.toolCalls ?? [];
    const ctx = detectContextFromTools(toolNames);
    if (ctx) {
      setCurrentContext(ctx);
      updateChatContext(ctx);
    }
     
    const assistantMessage: Message = {
  role: 'assistant',
  content: data.text || t.mcp_error || "Désolé, je n'ai pas pu répondre.",
  ui: data.ui || null,
  isConfirmation: data.requiresConfirmation || false,
  pendingAction: data.pendingAction || null,
  suggestions: data.suggestions ?? [], // ← nouveau
};

    const withAssistant = [...newMessages, assistantMessage];
    setMessages(withAssistant);
    saveMessages(withAssistant);
    setPendingConfirmation(assistantMessage.isConfirmation ? assistantMessage.pendingAction : null);
  } catch {
    const withError = [...newMessages, {
      role: 'assistant' as const,
      content: t.mcp_error || 'Erreur de connexion. Veuillez réessayer.',
    }];
    setMessages(withError);
    saveMessages(withError);
  } finally {
    setIsLoading(false);
  }
};

const handleConfirmation = async (confirmed: boolean) => {
  if (!pendingConfirmation) return;
  setIsLoading(true);

  const userResponse = confirmed ? 'Oui, confirme et procède.' : 'Non, annule.';
  const confirmMessage: Message = { role: 'user', content: userResponse 

  };
  const newMessages = [...messages, confirmMessage];
  setMessages(newMessages);
  saveMessages(newMessages);

  try {
     const response = await fetch(getAgentEndpoint(currentContext), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        buildRequestBody(
          buildContextMessages(messages, confirmMessage),
          confirmed ? pendingTool : null // ← passer pendingTool seulement si confirmed
        )
      ),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      if (response.status === 429) {
        const updated = [...newMessages, {
          role: 'assistant' as const,
          content: errData.text || '⏳ Limite atteinte.',
        }];
        setMessages(updated);
        saveMessages(updated);
        return;
      }
      throw new Error(errData.error || 'Server error');
    }

    const data = await response.json();
    const withAssistant = [...newMessages, {
      role: 'assistant' as const,
      content: data.text || 'Action effectuée.',
    }];
    setMessages(withAssistant);
    saveMessages(withAssistant);

  } catch {
    const withError = [...newMessages, {
      role: 'assistant' as const,
      content: 'Erreur lors de la confirmation.',
    }];
    setMessages(withError);
    saveMessages(withError);
  } finally {
    setPendingConfirmation(null);
    setIsLoading(false);
    setPendingTool(null);
  }
};

const suggestions = (CONTEXT_SUGGESTIONS[currentContext] || CONTEXT_SUGGESTIONS.general)
  .map(key => (t as any)[key])
  .filter(Boolean);

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

const handleEdit = useCallback((userIndex: number) => {
  setInput(messages[userIndex].content);
  inputRef.current?.focus();
}, [messages]);

const handleRetry = useCallback((assistantIndex: number) => {
  if (isLoading) return;

  // Trouver le message user juste avant ce message assistant
  const prevUserMsg = messages
    .slice(0, assistantIndex)
    .reverse()
    .find(m => m.role === 'user');

  if (!prevUserMsg) return;

  // Supprimer ce message assistant et tout ce qui suit
  const truncated = messages.slice(0, assistantIndex);
  setMessages(truncated);
  saveMessages(truncated);

  // Remettre le message user dans l'input pour le renvoyer
  setInput(prevUserMsg.content);
  inputRef.current?.focus();
}, [messages, isLoading, saveMessages]);

const handleSuggestionClick = (suggestion: string) => {
  setInput(suggestion);
  inputRef.current?.focus();
};

  return (
    <div className="flex flex-col bg-[#0f0f11]" style={{ height: '100dvh' }}>

      {/* Zone principale — scroll */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >
        {/* ÉCRAN D'ACCUEIL — chat vide */}
        {isEmptyChat && (
          <div className="flex flex-col items-center justify-center min-h-full px-4 py-12 gap-8">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-2">
                <Sparkles size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {t.mcp_welcome}
              </h2>
              <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
                {t.mcp_subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {suggestions.slice(0, 4).map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-start gap-2 p-4 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-indigo-500/30 rounded-2xl text-white/70 hover:text-white text-xs text-left transition-all active:scale-95"
                >
                  <Zap size={12} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES */}
        {!isEmptyChat && (
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {messages.map((msg, i) => (
  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    {msg.role === 'assistant' && (
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot size={14} className="text-white" />
      </div>
    )}

    <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
      <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        msg.role === 'user'
          ? 'bg-indigo-600 text-white rounded-tr-sm'
          : 'bg-white/[0.06] text-white/90 rounded-tl-sm border border-white/[0.06]'
      }`}>
        {msg.role === 'assistant' && msg.ui
          ? <MCPUIRenderer ui={msg.ui} lang={lang} />
          : <p className="whitespace-pre-wrap">{msg.content}</p>
        }
      </div>

      {/* Confirmation buttons */}
      {msg.isConfirmation && (
        <div className="flex gap-2 w-full">
          <button onClick={() => handleConfirmation(true)} disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium transition-all disabled:opacity-50">
            <CheckCircle size={14} /> {t.confirm}
          </button>
          <button onClick={() => handleConfirmation(false)} disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium transition-all disabled:opacity-50">
            <XCircle size={14} />{t.cancel}
          </button>
        </div>
      )}

      {/* ← Actions sous chaque message */}
      {msg.role === 'user' ? (
        // Message USER — copy + retry + edit
        <UserMessageActions
          content={msg.content}
          onRetry={() => handleRetry(i)}
          onEdit={() => handleEdit(i)}
          t={t}
        />
      ) : (
        // Message ASSISTANT — copy + suggestions
        !msg.isConfirmation && (
          <MessageActions
            content={msg.content}
            suggestions={msg.suggestions ?? []}
            onSuggestionClick={handleSuggestionClick}
            t={t}
          />
        )
      )}
    </div>
  </div>
))}

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
        )}
      </div>

      {/* Suggestions compactes */}
      {!isEmptyChat && suggestions.length > 0 && !isLoading && (
        <div
          className="flex-shrink-0 px-4 pt-2 pb-1 flex gap-2 overflow-x-auto border-t border-white/[0.04]"
          style={{ scrollbarWidth: 'none' }}
        >
          {suggestions.slice(0, 4).map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-full text-white/60 hover:text-white/90 text-xs transition-all"
            >
              <Zap size={10} className="text-indigo-400" />
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-20 pt-2 bg-[#0f0f11] md:pb-4">
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
  );
}