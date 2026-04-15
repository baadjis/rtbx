/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { QRCodeCanvas } from 'qrcode.react';
import { Download, QrCode, ExternalLink } from 'lucide-react';

export default function FormAdminClient({ formId, t, lang }: any) {
  const publicUrl = `https://rtbx.space/f/${formId}`;

  const downloadQR = () => {
    const canvas = document.getElementById('form-qr') as HTMLCanvasElement;
    const link = document.createElement('a');
    link.download = `qr-survey-${formId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                <QrCode size={20} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{t.share_title}</h3>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
            {t.share_desc}
        </p>

        <div className="p-6 bg-white rounded-[2rem] shadow-inner border border-gray-50 inline-block">
            <QRCodeCanvas 
                id="form-qr"
                value={publicUrl}
                size={180}
                level="H"
                marginSize={4}
            />
        </div>

        <div className="space-y-3 pt-4">
            <button 
                onClick={downloadQR}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
                <Download size={16} className="inline mr-2" /> {t.btn_dl_qr_hd || "Télécharger QR"}
            </button>
            <a 
                href={publicUrl} 
                target="_blank"
                className="block w-full py-4 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 no-underline"
            >
                <ExternalLink size={16} className="inline mr-2" /> {t.btn_link}
            </a>
        </div>
    </div>
  );
}