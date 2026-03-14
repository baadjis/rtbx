'use client'
import { useRouter } from 'next/navigation';

export default function LangSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();

  const toggleLang = () => {
    const newLang = currentLang === 'fr' ? 'en' : 'fr';
    // On définit le cookie pour que le Python de Hugging Face le voit aussi
    document.cookie = `lang=${newLang}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <button 
      onClick={toggleLang}
      className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
    >
      {currentLang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
    </button>
  );
}