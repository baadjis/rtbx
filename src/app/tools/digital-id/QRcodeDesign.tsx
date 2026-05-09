/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'


import { QRCodeCanvas } from 'qrcode.react'
import Image from 'next/image'
import { ArrowRight, Download, Palette, Upload } from 'lucide-react'
import Link from 'next/link'
import { LangType } from '@/lib/lang/types'
import { getQrIcon, ICON_PATHS } from '@/utils/qr-utils'


type QrcodeDesignProps={
        
        logo:any
        setLogo:any,
        fgColor:string,
        setFgColor:any,
        bgColor:string,
        setBgColor:any,
        handle:any,
        generatedId:string|null,
        lang:LangType,
        t:any,
        spaceType:any


}

export default function QRCodeDesign({
    logo,setLogo,fgColor,setFgColor,bgColor,setBgColor,handle,generatedId,lang,t,
    spaceType
    

}:QrcodeDesignProps){

     const handleLogoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0]

    if (file) {

      const reader = new FileReader()

      reader.onloadend = () =>
        setLogo(reader.result as string)

      reader.readAsDataURL(file)
    }
  }
   // =========================================================
  // DOWNLOAD
  // =========================================================

  const downloadQR = () => {

    const canvas = document.getElementById(
      'did-qr-canvas'
    ) as HTMLCanvasElement

    if (!canvas) return

    const url = canvas.toDataURL('image/png')

    const link = document.createElement('a')

    link.download =
      `retailbox-space-${spaceType}.png`

    link.href = url

    link.click()
  }

  const publicUrl = handle
    ? `https://www.rtbx.space/u/${handle}`
    : 'https://www.rtbx.space'
   return(

      <div className="self-start lg:sticky lg:top-8"> 
      
      <div className="mb-8">
  <h2 className="
    text-4xl md:text-5xl
    font-black
    tracking-tight
    italic
    leading-tight
    bg-gradient-to-r
    from-indigo-600
    to-violet-600
    bg-clip-text
    text-transparent
    text-center
  ">
    QRCode 
  </h2>
</div>
       
           
<div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(79,70,229,0.08)] border border-gray-100 dark:border-slate-800 flex flex-col items-center transition-colors">
              {/* DESIGN */}

              {/* 4. DESIGN */}
<div className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 space-y-6">
  
  <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
    <Palette size={14}/>
    {lang === 'fr' ? 'Personnalisation' : 'Customization'}
  </h4>

  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <label className="text-[9px] font-black text-gray-400 uppercase ml-2">
        {t.label_qr}
      </label>

      <input
        type="color"
        value={fgColor}
        onChange={(e) => setFgColor(e.target.value)}
        className="w-full h-12 rounded-xl cursor-pointer border-none bg-gray-50 dark:bg-slate-800 p-1"
      />
    </div>

    <div className="space-y-2">
      <label className="text-[9px] font-black text-gray-400 uppercase ml-2">
        {t.label_bg}
      </label>

      <input
        type="color"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
        className="w-full h-12 rounded-xl cursor-pointer border-none bg-gray-50 dark:bg-slate-800 p-1"
      />
    </div>
  </div>

  {/*design */}

  <div className="space-y-2">
    <label className="text-[9px] font-black text-gray-400 uppercase ml-2 flex justify-between">
      {t.label_logo}

      {logo && (
        <button
          onClick={() => setLogo(null)}
          className="text-red-500 text-[9px] font-bold bg-transparent border-none cursor-pointer hover:underline"
        >
          {t.did_delete}
        </button>
      )}
    </label>

    <div className="relative group h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center hover:border-indigo-400 transition-colors">
      
      {logo ? (
        <Image
          src={logo}
          alt="Logo"
          className="h-10 object-contain"
          width={40}
          height={40}
        />
      ) : (
        <Upload size={20} className="text-gray-300" />
      )}

      <input
        type="file"
        onChange={handleLogoUpload}
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  </div>
</div>
              <div className="p-8 bg-white rounded-[2.5rem] mb-10 border border-gray-50 shadow-inner relative group overflow-hidden">

                <QRCodeCanvas
                  id="did-qr-canvas"
                  value={publicUrl}
                  size={260}
                  level="H"
                  marginSize={4}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  imageSettings={
                    logo
                      ? {
                          src: logo,
                          height: 50,
                          width: 50,
                          excavate: true
                        }
                      : {
                          src: getQrIcon(
                            ICON_PATHS.users,
                            fgColor
                          ),
                          height: 40,
                          width: 40,
                          excavate: true
                        }
                  }
                />

              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">

                {spaceType} Space

              </h3>

              {generatedId && (

                <div className="mb-8 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">

                  <p className="text-indigo-600 dark:text-indigo-400 font-black text-sm tracking-tight">
                    rtbx.space/@/{handle}
                  </p>

                </div>

              )}

              <div className="space-y-4 w-full">

                <button
                  onClick={downloadQR}
                  disabled={!handle}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-30 border-none cursor-pointer"
                >

                  <Download className="w-6 h-6" />

                  {t.btn_dl_did}

                </button>

                {generatedId && (

                  <Link
                    href={`/u/${handle}`}
                    target="_blank"
                    className="w-full py-4 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-2xl font-black border border-gray-100 dark:border-slate-800 no-underline flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
                  >

                    {t.open_page}

                    <ArrowRight size={18} />

                  </Link>

                )}

              </div>

            </div>

          </div>)

}