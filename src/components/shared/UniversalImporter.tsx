/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useRef } from 'react'
import { 
  FileText, Clipboard, Upload, CheckCircle2, 
  AlertTriangle, X, ChevronRight, Table, 
  Settings2, ArrowRight, Loader2
} from 'lucide-react'
import { RetailParser, StandardField } from '@/utils/retail-parser'

interface ImporterProps {
  title: string;
  description: string;
  requiredFields: StandardField[];
  availableFields: { value: StandardField, label: string }[];
  onImport: (data: any[]) => void; // La fonction qui recevra les données propres
  lang: 'fr' | 'en';
}

export default function UniversalImporter({ 
  title, description, requiredFields, availableFields, onImport, lang 
}: ImporterProps) {
  const [step, setStep] = useState<'input' | 'mapping' | 'preview'>('input')
  const [rawText, setRawText] = useState('')
  const [parsedData, setParsedData] = useState<any[]>([])
  const [mapping, setMapping] = useState<Record<string, StandardField>>({})
  const [cleanedResult, setCleanedResult] = useState<{data: any[], errors: string[]}>({ data: [], errors: [] })
  const [loading, setLoading] = useState(false)

  // --- LOGIQUE ÉTAPE 1 : PARSING ---
  const handleStartParsing = async () => {
    if (!rawText.trim()) return
    setLoading(true)
    const data = await RetailParser.parseRawText(rawText)
    if (data.length > 0) {
      const headers = Object.keys(data[0])
      const guessedMapping = RetailParser.guessMapping(headers)
      setParsedData(data)
      setMapping(guessedMapping)
      setStep('mapping')
    }
    setLoading(false)
  }

  // --- LOGIQUE ÉTAPE 2 : MAPPING ---
  const applyMapping = () => {
  // 1. Exécuter le nettoyage
  const result = RetailParser.validateAndClean(parsedData, mapping, requiredFields);
  
  // 2. Vérification de sécurité : y a-t-il au moins une ligne valide ?
  if (result?.data.length === 0) {
    const errorMsg = lang === 'fr' 
      ? "Aucune donnée valide trouvée. Assurez-vous d'avoir associé les colonnes obligatoires." 
      : "No valid data found. Please make sure you have mapped the required fields.";
    
    alert(errorMsg);
    return; // On arrête tout ici, l'utilisateur doit corriger son mapping
  }

  // 3. Si c'est bon, on enregistre et on passe à la prévisualisation
  setCleanedResult(result);
  setStep('preview');
};
  // --- LOGIQUE ÉTAPE 3 : FINALISATION ---
  const finalize = () => {
    onImport(cleanedResult.data)
    reset()
  }

  const reset = () => {
    setStep('input'); setRawText(''); setParsedData([]); setCleanedResult({data:[], errors:[]})
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-500">
      
      {/* HEADER DE L'IMPORTEUR */}
      <div className="p-8 border-b border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
        <div className="flex justify-between items-center">
            <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{description}</p>
            </div>
            <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${
                        (i === 1 && step === 'input') || (i === 2 && step === 'mapping') || (i === 3 && step === 'preview')
                        ? 'bg-indigo-600 w-6' : 'bg-gray-200 dark:bg-slate-700'
                    } transition-all duration-300`}></div>
                ))}
            </div>
        </div>
      </div>

      <div className="p-8">
        
        {/* ÉTAPE 1 : SAISIE BRUTE */}
        {step === 'input' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                <Clipboard size={14} /> Coller vos données depuis Excel, CSV ou Texte
            </div>
            <textarea 
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Email, Nom, Prénom...&#10;jean@mail.com, Dupont, Jean&#10;marie@mail.com, Lefebvre, Marie"
              className="w-full h-64 p-6 bg-gray-50 dark:bg-slate-800 border-none rounded-[2rem] focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-gray-700 dark:text-slate-200 transition-colors"
            />
            <div className="flex justify-end gap-4">
                <button onClick={() => setRawText('')} className="px-6 py-3 text-gray-400 font-bold hover:text-red-500 transition-colors">Vider</button>
                <button 
                    disabled={!rawText || loading}
                    onClick={handleStartParsing}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <ChevronRight size={20} />}
                    Suivant
                </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : MAPPING DES COLONNES */}
        {step === 'mapping' && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800 flex gap-4">
                <Settings2 className="text-indigo-600 flex-shrink-0" />
                <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">
                    Nous avons détecté les colonnes suivantes. Vérifiez que chaque champ correspond bien à vos données.
                </p>
            </div>

            <div className="space-y-3">
                {Object.keys(mapping).map((header) => (
                    <div key={header} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                        <span className="font-bold text-gray-700 dark:text-slate-300 px-2">{header}</span>
                        <div className="flex items-center gap-3">
                            <ArrowRight size={16} className="text-gray-300" />
                            <select 
                                value={mapping[header]}
                                onChange={(e) => setMapping({...mapping, [header]: e.target.value as StandardField})}
                                className="bg-white dark:bg-slate-800 border-none rounded-xl text-sm font-black text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 shadow-sm"
                            >
                                {availableFields.map(field => (
                                    <option key={field.value} value={field.value}>{field.label}</option>
                                ))}
                                <option value="ignore">❌ Ignorer cette colonne</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between">
                <button onClick={() => setStep('input')} className="px-6 py-3 text-gray-400 font-bold hover:text-indigo-600">Retour</button>
                <button onClick={applyMapping} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 flex items-center gap-2">
                    Analyser les données <CheckCircle2 size={20} />
                </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : PRÉVISUALISATION ET ERREURS */}
        {step === 'preview' && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-3xl border border-green-100 dark:border-green-800">
                    <h4 className="text-green-700 dark:text-green-400 font-black text-2xl">{cleanedResult.data.length}</h4>
                    <p className="text-green-600 dark:text-green-500 text-sm font-bold uppercase tracking-widest">Lignes valides prêtes</p>
                </div>
                <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-100 dark:border-amber-800">
                    <h4 className="text-amber-700 dark:text-amber-400 font-black text-2xl">{cleanedResult.errors.length}</h4>
                    <p className="text-amber-600 dark:text-amber-500 text-sm font-bold uppercase tracking-widest">Lignes ignorées ou erronées</p>
                </div>
            </div>

            {cleanedResult.errors.length > 0 && (
                <div className="max-h-40 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl text-xs font-medium text-gray-500">
                    {cleanedResult.errors.map((err, i) => <p key={i}>• {err}</p>)}
                </div>
            )}

            <div className="flex justify-between">
                <button onClick={() => setStep('mapping')} className="px-6 py-3 text-gray-400 font-bold hover:text-indigo-600">Modifier le mapping</button>
                <button onClick={finalize} className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
                    Importer {cleanedResult.data.length} éléments
                </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}