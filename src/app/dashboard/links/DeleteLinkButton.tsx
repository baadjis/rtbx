'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeleteLinkButton({ linkId, lang }: { linkId: string, lang: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleDelete = async () => {
    const confirmMsg = lang === 'fr' 
      ? "Supprimer ce lien définitivement ?" 
      : "Delete this link permanently?"
    
    if (!confirm(confirmMsg)) return

    setIsDeleting(true)
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId)

    if (error) {
      alert(error.message)
      setIsDeleting(false)
    } else {
      router.refresh() // Recharge les données du serveur
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 dark:hover:border-red-900 transition-all shadow-sm disabled:opacity-50"
    >
      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  )
}