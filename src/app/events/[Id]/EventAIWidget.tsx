// app/events/[id]/EventAIWidget.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const SUGGESTIONS = {
  fr: ["Voir l'agenda", "Comment s'inscrire ?", "Infos pratiques", "Contacter l'organisateur"],
  en: ["View agenda", "How to register?", "Practical info", "Contact organizer"],
};

export default function EventAIWidget({
  eventId,
  eventTitle,
  lang = 'fr',
}: {
  eventId: string;
  eventTitle: string;
  lang?: 'fr' | 'en';
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isEmptyChat = messages.length === 0;
  const suggestions = SUGGESTIONS[lang];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const content = text || input;
    if (!content.trim() || loading) return;

    const userMsg: Message = { role: 'user', content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agents/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          lang,
          eventId,
        }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.text || "Désolé, je n'ai pas pu répondre.",
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: lang === 'fr' ? 'Erreur de connexion.' : 'Connection error.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const openFullChat = () => {
    const id = crypto.randomUUID();
    const chats = JSON.parse(localStorage.getItem('rtbx_chats') || '[]');
    chats.unshift({
      id,
      title: eventTitle,
      context: 'event',
      entityId: eventId,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('rtbx_chats', JSON.stringify(chats.slice(0, 50)));
    localStorage.setItem(`rtbx_chat_context_${id}`, 'event');
    localStorage.setItem(`rtbx_chat_entity_${id}`, eventId);
    window.dispatchEvent(new Event('rtbx_chats_updated'));
    router.push(`/ai/chat/${id}`);
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 md:bottom-8 md:right-6 w-[calc(100vw-2rem)] max-w-sm z-50 flex flex-col bg-[#0f0f11] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden"
          style={{ height: '480px' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Sparkles size={13} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Assistant événement</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-white/30">En ligne</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={openFullChat}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Ouvrir complet →
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 transition-all"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            style={{ scrollbarWidth: 'none' }}>

            {isEmptyChat && (
              <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">
                    {lang === 'fr' ? 'Posez vos questions' : 'Ask your questions'}
                  </p>
                  <p className="text-xs text-white/30">
                    {lang === 'fr'
                      ? `Je connais tout sur "${eventTitle}"`
                      : `I know everything about "${eventTitle}"`}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      className="flex items-center gap-1.5 p-2.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-xl text-white/60 hover:text-white text-[11px] text-left transition-all"
                    >
                      <Zap size={10} className="text-indigo-400 flex-shrink-0" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isEmptyChat && messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={12} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-white/[0.06] text-white/90 rounded-tl-sm border border-white/[0.06]'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl rounded-tl-sm px-3 py-2.5">
                  <div className="flex gap-1 items-center h-3">
                    {[0, 150, 300].map(d => (
                      <span key={d} className="w-1 h-1 rounded-full bg-white/30 animate-bounce"
                        style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={lang === 'fr' ? 'Posez une question...' : 'Ask a question...'}
                disabled={loading}
                className="flex-1 bg-transparent text-white/90 text-xs placeholder:text-white/25 outline-none"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="w-6 h-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/[0.06] text-white flex items-center justify-center transition-all"
              >
                <Send size={11} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 ${
          open
            ? 'bg-white/10 text-white border border-white/10'
            : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
        }`}
      >
        {open ? <X size={18} /> : <Sparkles size={18} />}
        <span className="text-sm font-semibold">
          {open
            ? (lang === 'fr' ? 'Fermer' : 'Close')
            : (lang === 'fr' ? 'Ask AI' : 'Ask AI')}
        </span>
      </button>
    </>
  );
}