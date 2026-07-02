// app/ai/components/MessageActions.tsx
'use client';
import { useState } from 'react';
import { Copy, CheckCheck, RotateCcw } from 'lucide-react';

type Props = {
  content: string;
  onRetry?: () => void;
  suggestions?: string[];
  onSuggestionClick?: (s: string) => void;
  lang?: 'fr' | 'en';
};

export default function MessageActions({
  content,
  onRetry,
  suggestions = [],
  onSuggestionClick,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2 mt-2">
      {/* Suggestions chips */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick?.(s)}
              className="px-3 py-1.5 bg-white/[0.05] hover:bg-indigo-500/20 border border-white/[0.08] hover:border-indigo-500/30 rounded-xl text-white/50 hover:text-indigo-300 text-xs font-medium transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Actions — copy + retry */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Copy */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/25 hover:text-white/60 transition-all"
          title="Copier"
        >
          {copied
            ? <CheckCheck size={13} className="text-emerald-400" />
            : <Copy size={13} />
          }
        </button>

        {/* Retry */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/25 hover:text-white/60 transition-all"
            title="Réessayer"
          >
            <RotateCcw size={13} />
          </button>
        )}
      </div>
    </div>
  );
}