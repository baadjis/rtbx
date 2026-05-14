/* eslint-disable @typescript-eslint/no-explicit-any */

import { SpaceAvatar } from "./SpaceAvatar"

type SpaceHeaderProps={
    imageUrl?:string,
    isProfileOnly:boolean
    themeColor?:string
    displayName:string
    t:any
    entity:any
}
export default function SpaceHeader({ imageUrl,themeColor,displayName ,isProfileOnly,t,entity}:SpaceHeaderProps){
return(
 <div className="space-y-6 animate-in fade-in zoom-in duration-700">
            
            <SpaceAvatar imageUrl={imageUrl}  themeColor={themeColor} displayName={displayName} variant='circle'/>
            <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 leading-tight uppercase italic">
                    {displayName}
                </h1>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                   <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">
                      {isProfileOnly ? t.badge_personal : (entity.space_type === 'organization' ? 'Verified Organization' : t.badge_label)}
                   </span>
                </div>
            </div>
        </div>

)

}