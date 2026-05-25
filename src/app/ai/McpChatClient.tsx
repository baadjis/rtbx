/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, CheckCircle, XCircle } from 'lucide-react';
import type { LangType } from '@/lib/lang/types';
import { Data } from './data';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  isConfirmation?: boolean;
  pendingAction?: any;
};

export default function MCPChatClient({ lang }: { lang: LangType }) {
  const t = Data[lang];

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.mcp_welcome }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<any>(null);
  const [currentContext, setCurrentContext] = useState<'general' | 'space' | 'business' | 'shortener'>('general');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggestions dynamiques selon le contexte
  const getSuggestions = () => {
    if (currentContext === 'space') {
      return [
        t.mcp_suggestion_update_space,
        t.mcp_suggestion_change_theme,
        t.mcp_suggestion_add_social,
      ].filter(Boolean);
    }

    if (currentContext === 'business') {
      return [
        t.mcp_suggestion_add_contact,
        t.mcp_suggestion_update_address,
        t.mcp_suggestion_add_logo,
      ].filter(Boolean);
    }

    if (currentContext === 'shortener') {
      return [
        t.mcp_suggestion_create_another_link,
        t.mcp_suggestion_view_my_links,
        t.mcp_suggestion_view_link_stats,
      ].filter(Boolean);
    }

    // Suggestions par défaut
    return [
      t.mcp_suggestion_create_space,
      t.mcp_suggestion_create_business,
      t.mcp_suggestion_create_short_link,
      t.mcp_suggestion_ideas,
    ].filter(Boolean);
  };

  const suggestions = getSuggestions();

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
          messages: [...messages, userMessage],
          lang
        }),
      });

      const data = await response.json();

      const newMessage: Message = {
        role: 'assistant',
        content: data.text || t.mcp_error || "Désolé, je n'ai pas pu répondre.",
        isConfirmation: data.requiresConfirmation || false,
        pendingAction: data.pendingAction || null
      };

      setMessages(prev => [...prev, newMessage]);
      setPendingConfirmation(newMessage.isConfirmation ? newMessage.pendingAction : null);

      // Détection intelligente du contexte
      const lowerText = (data.text || '').toLowerCase();
      if (lowerText.includes('space') || lowerText.includes('profil')) {
        setCurrentContext('space');
      } else if (lowerText.includes('business') || lowerText.includes('entreprise')) {
        setCurrentContext('business');
      } else if (lowerText.includes('lien') || lowerText.includes('short')) {
        setCurrentContext('shortener');
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t.mcp_error || "Erreur de connexion. Veuillez réessayer plus tard."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmation = async (confirmed: boolean) => {
    if (!pendingConfirmation) return;

    setIsLoading(true);

    const userResponse = confirmed ? "Oui, confirme et procède." : "Non, annule.";

    try {
      const response = await fetch('/mcp/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userResponse }],
          lang
        }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.text
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Erreur lors de la confirmation."
      }]);
    } finally {
      setPendingConfirmation(null);
      setIsLoading(false);
    }
  };

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pb-24">
      <div className="max-w-4xl mx-auto pt-12 px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-indigo-400" />
            <h1 className="text-5xl font-black tracking-tighter">RTBX MCP</h1>
          </div>
          <p className="text-slate-400 text-lg">{t.mcp_subtitle}</p>
        </div>

        {/* Chat Container */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700 rounded-3xl h-[calc(100vh-180px)] flex flex-col overflow-hidden shadow-2xl">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={20} />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-3xl px-6 py-4 ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-800 border border-slate-700'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                  {msg.isConfirmation && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleConfirmation(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 rounded-2xl text-sm font-medium transition-all"
                      >
                        <CheckCircle size={18} />
                        Oui, Confirmer
                      </button>
                      <button
                        onClick={() => handleConfirmation(false)}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 rounded-2xl text-sm font-medium transition-all"
                      >
                        <XCircle size={18} />
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Dynamic Suggestions */}
          <div className="p-4 border-t border-slate-700 bg-slate-900/50">
            <p className="text-xs text-slate-500 mb-3 px-2">{t.mcp_suggestions}</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="text-sm px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all active:scale-95"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={t.mcp_placeholder}
                className="flex-1 bg-slate-800 border border-slate-600 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
              >
                <Send size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}