import { getBusinessProviderLinks} from "@/lib/business-provider-links/service"
import { getBusinessOpeningHours } from "@/lib/business-opening-hours/service";
import BusinessSettingsClient from "./BusinessSettingsClient"
import { getLang } from "@/lib/lang/lang-getter"
import { LangType } from "@/lib/lang/types";
import { DATA } from "./data";
import { createClient } from "@/utils/supabase/server";
import { getBusinessLoyaltyRewards, getBusinessLoyaltySettings } from "@/lib/business-loyalty/service";
import { getBusiness } from "@/lib/businesses/service";
import { getBusinessAppLinks } from "@/lib/business-app-links/service";


export default  async function BusinessSettingPage({ params }: { params: Promise<{ Id: string }> }){
    const { Id } = await params;

    const lang =await getLang() as LangType;
    const supabase = await createClient();
    const userResponse= await supabase.auth.getUser()
    const user=userResponse.data.user

   
    
    const t= DATA[lang]


    const [
  business,
  providerLinks,
  openingHours,
  loyaltySettings,
  rewards,
  businessAppLinks
] = await Promise.all([

 
  getBusiness(Id,user?.id as string),
  getBusinessProviderLinks(Number(Id)),

  getBusinessOpeningHours(Number(Id)),
  getBusinessLoyaltySettings(Number(Id)),
  getBusinessLoyaltyRewards(Number(Id)),
  getBusinessAppLinks(Number(Id))


])

return (

  <BusinessSettingsClient

    business={business?.data}

    providerLinks={
      providerLinks?.data || []
    }
    loyaltySettings={loyaltySettings?.data || []}
    businessRewards={rewards?.data || []}
    openingHours={openingHours?.data || []}
    businessAppLinks={businessAppLinks?.data || []}
    t={t}
    lang={lang}
    

  />

)
}
