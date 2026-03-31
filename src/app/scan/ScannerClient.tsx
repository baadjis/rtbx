'use client'
import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle2, ArrowLeft, RefreshCw, ShieldCheck, Camera } from 'lucide-react';
import Link from 'next/link';

const DICT = {
  fr: {
    title: "Scanner un client",
    instruction: "Placez le QR Code dans le cadre",
    status_success: "Client identifié !",
    btn_add: "Ajouter +1 Point",
    btn_retry: "Scanner à nouveau",
    tip: "Le client doit ouvrir son Pass RetailBox."
  },
  en: {
    title: "Scan Customer",
    instruction: "Place the QR Code inside the frame",
    status_success: "Customer identified!",
    btn_add: "Add +1 Point",
    btn_retry: "Scan again",
    tip: "The customer must open their RetailBox Pass."
  }
};

export default function ScannerClient({ lang }: { lang: 'fr' | 'en' }) {
  const t = DICT[lang];
  const [result, setResult] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Le scanner ne s'initialise que si le résultat est vide et que l'élément "reader" existe
    if (!result && document.getElementById("reader")) {
      const scanner = new Html5QrcodeScanner("reader", { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true
      }, false);

      scanner.render((decodedText) => {
        setResult(decodedText);
        scanner.clear().catch(err => console.error("Error clearing", err));
      }, (error) => { /* Erreurs de lecture silencieuses */ });

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Cleanup error", err));
      }
    };
  }, [result]);

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8">
      
      {/* HEADER COMPACT */}
      <div className="w-full flex items-center justify-between text-white">
        <Link href="/dashboard" className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all no-underline border-none">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-black uppercase tracking-widest leading-none">{t.title}</h1>
        <div className="w-10"></div>
      </div>

      {/* ZONE DE SCAN */}
      <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-indigo-500 shadow-[0_0_60px_rgba(79,70,229,0.4)] bg-black">
        <div id="reader" className="w-full h-full"></div>

        {!result && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
             <div className="w-64 h-64 border-2 border-white/20 rounded-[2.5rem] mb-6 relative">
                <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-indigo-400 rounded-tl-2xl"></div>
                <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-indigo-400 rounded-tr-2xl"></div>
                <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-indigo-400 rounded-bl-2xl"></div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-indigo-400 rounded-br-2xl"></div>
             </div>
             <p className="text-white font-black text-xs uppercase tracking-[0.2em] animate-pulse">{t.instruction}</p>
          </div>
        )}
      </div>

      {/* RÉSULTAT ET ACTION */}
      <div className="w-full min-h-[140px]">
        {result ? (
          <div className="bg-white rounded-[2.5rem] p-8 text-slate-900 animate-in zoom-in slide-in-from-bottom-4 duration-300 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center border border-green-100">
                <CheckCircle2 size={32} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.status_success}</p>
                <p className="font-bold text-base truncate text-indigo-600">ID: {result}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { alert("Point validé !"); setResult(null); }}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 active:scale-95 transition-all border-none"
                >
                  {t.btn_add}
                </button>
                <button 
                  onClick={() => setResult(null)}
                  className="w-full py-3 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors bg-transparent border-none"
                >
                  <RefreshCw size={14} className="inline mr-2" /> {t.btn_retry}
                </button>
            </div>
          </div>
        ) : (
          <div className="text-center px-10">
             <p className="text-white/40 text-sm font-medium leading-relaxed italic">{t.tip}</p>
          </div>
        )}
      </div>

      <div className="mt-auto pb-6">
        <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
           <ShieldCheck size={12} /> Verified Secured Node
        </div>
      </div>
    </div>
  );
}