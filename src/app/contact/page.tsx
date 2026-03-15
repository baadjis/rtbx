/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);
  const FORMSPREE_ID =process.env.FORMSPREE_ID!

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    
    setStatus("sending");
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST", body: data, headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <BrandLogo />
        <h1 className="text-2xl font-black text-center mb-8">Contactez-nous</h1>
        
        {status === "success" && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl font-bold border border-green-100 text-center">
            ✅ Message envoyé ! Nous vous répondons sous 48h.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="Votre email" required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium" />
          <textarea name="message" placeholder="Votre message" rows={5} required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium"></textarea>
          <button type="submit" disabled={status === "sending"} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
            {status === "sending" ? "Envoi..." : "Envoyer le message"}
          </button>
        </form>
      </div>
    </div>
  );
}