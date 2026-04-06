'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Redevient l'icône copy après 2s
    } catch (err) {
      console.error('Erreur lors de la copie', err)
    }
  }

  return (
    <button 
      onClick={handleCopy}
      title="Copier le lien"
      className={`p-3 border rounded-xl transition-all shadow-sm flex items-center justify-center
        ${copied 
          ? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
          : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
    </button>
  )
}