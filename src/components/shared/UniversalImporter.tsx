/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useRef } from 'react'
import { 
  Clipboard, Upload, CheckCircle2, 
  ChevronRight, Settings2, ArrowRight, 
  Loader2, AlertCircle, FileSpreadsheet, X 
} from 'lucide-react'
import { RetailParser, StandardField } from '@/utils/retail-parser'

interface ImporterProps {
  title: string;
  description: string;
  requiredFields: StandardField[];
  availableFields: { value: StandardField, label: string }[];
  onImport: (data: any[]) => void;
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processData = (data: any[]) => {
    if (data.length > 0) {
      const headers = Object.keys(data[0])
      const guessedMapping = RetailParser.guessMapping(headers)
      setParsedData(data)
      setMapping(guessedMapping)
      setStep('mapping')
      setErrorMessage(null)
    } else {
      setErrorMessage(lang === 'fr' ? "Le fichier semble vide." : "The file appears to be empty.")
    }
    setLoading(false)
  }

  const handleStartParsing = async () => {
    if (!rawText.trim()) return
    setLoading(true)
    const data = await RetailParser.parseRawText(rawText)
    processData(data)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setErrorMessage(null)
    
    try {
      const data = await RetailParser.parseFile(file)
      processData(data)
    } catch (err: any) {
      setErrorMessage(err)
      setLoading(false)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const applyMapping = () => {
    const result = RetailParser.validateAndClean(parsedData, mapping, requiredFields)
    if (result.data.length === 0) {
      alert(lang === 'fr' ? "Aucune donnée valide trouvée." : "No valid data found.")
      return
    }
    setCleanedResult(result)
    setStep('preview')
  }

  const finalize = () => {
    onImport(cleanedResult.data)
    reset()
  }

  const reset = () => {
    setStep('input'); setRawText(''); setParsedData([]); setErrorMessage(null)
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
      
      {/* HEADER */}
      <div className="p-8 border-b border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
        <div className="flex justify-between items-center text-gray-900 dark:text-white">
            <div>
                <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{description}</p>
            </div>
            <div className="flex items-center gap-3">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv, .xlsx, .xls, .json, .txt" className="hidden" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-widest border border-gray-200 dark:border-slate-700 hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
              >
                <Upload size={14} /> {lang === 'fr' ? 'Importer Fichier' : 'Upload File'}
              </button>
            </div>
        </div>
      </div>

      <div className="p-8">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center gap-3 font-bold text-sm">
            <AlertCircle size={18} /> {errorMessage}
          </div>
        )}

        {step === 'input' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <Clipboard size={12} /> {lang === 'fr' ? 'Saisie manuelle ou copier-coller' : 'Manual entry or paste'}
            </div>
            <textarea 
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={lang === 'fr' ? "Email, Nom...\njean@mail.com, Dupont" : "Email, Name...\njohn@mail.com, Doe"}
              className="w-full h-64 p-6 bg-gray-50 dark:bg-slate-800 border-none rounded-[2rem] focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-gray-700 dark:text-slate-200 transition-colors"
            />
            <div className="flex justify-end gap-4">
                <button 
                  disabled={!rawText || loading}
                  onClick={handleStartParsing}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 border-none cursor-pointer"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <ChevronRight size={20} />}
                    {lang === 'fr' ? 'Suivant' : 'Next'}
                </button>
            </div>
          </div>
        )}

        {step === 'mapping' && (
          <div className="space-y-8 animate-in slide-in-from-right-8">
            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800 flex gap-4">
                <Settings2 className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">
                    {lang === 'fr' ? 'Associez vos colonnes aux champs RetailBox.' : 'Map your columns to RetailBox fields.'}
                </p>
            </div>

            <div className="space-y-3">
                {Object.keys(mapping).map((header) => (
                    <div key={header} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                        <span className="font-bold text-gray-700 dark:text-slate-300 px-2 truncate max-w-[200px]">{header}</span>
                        <div className="flex items-center gap-3">
                            <ArrowRight size={16} className="text-gray-300" />
                            <select 
                                value={mapping[header]}
                                onChange={(e) => setMapping({...mapping, [header]: e.target.value as StandardField})}
                                className="bg-white dark:bg-slate-800 border-none rounded-xl text-sm font-black text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 shadow-sm px-4 py-2 appearance-none cursor-pointer"
                            >
                                {availableFields.map(field => (
                                    <option key={field.value} value={field.value}>{field.label}</option>
                                ))}
                                <option value="ignore">❌ {lang === 'fr' ? 'Ignorer' : 'Ignore'}</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between">
                <button onClick={() => setStep('input')} className="px-6 py-3 text-gray-400 font-bold hover:text-indigo-600 border-none bg-transparent cursor-pointer italic text-sm">{lang === 'fr' ? 'Retour' : 'Back'}</button>
                <button onClick={applyMapping} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 border-none cursor-pointer">
                    {lang === 'fr' ? 'Analyser' : 'Analyze'}
                </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-8 animate-in zoom-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900 dark:text-white">
                <div className="p-8 bg-green-50 dark:bg-green-900/20 rounded-[2rem] border border-green-100 dark:border-green-800 text-center">
                    <h4 className="text-green-700 dark:text-green-400 font-black text-3xl mb-1">{cleanedResult.data.length}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{lang === 'fr' ? 'Lignes valides' : 'Valid rows'}</p>
                </div>
                <div className="p-8 bg-amber-50 dark:bg-amber-900/20 rounded-[2rem] border border-amber-100 dark:border-amber-800 text-center">
                    <h4 className="text-amber-700 dark:text-amber-400 font-black text-3xl mb-1">{cleanedResult.errors.length}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{lang === 'fr' ? 'Lignes ignorées' : 'Ignored rows'}</p>
                </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-50 dark:border-slate-800">
                <button onClick={() => setStep('mapping')} className="text-gray-400 font-bold hover:text-indigo-600 bg-transparent border-none cursor-pointer text-sm underline">{lang === 'fr' ? 'Modifier le mapping' : 'Modify mapping'}</button>
                <button onClick={finalize} className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-3xl font-black shadow-2xl hover:scale-105 transition-all border-none cursor-pointer text-lg">
                    {lang === 'fr' ? `Importer ${cleanedResult.data.length}` : `Import ${cleanedResult.data.length}`}
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}