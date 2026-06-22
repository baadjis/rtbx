import { getBusinessProviderLinks} from "@/lib/business-provider-links/service"
import { getBusinessOpeningHours } from "@/lib/business-opening-hours/service";
import BusinessSettingsClient from "./BusinessSettingsClient"
import { getLang } from "@/lib/lang/lang-getter"
import { LangType } from "@/lib/lang/types";
import { DATA } from "./data";
import { createClient } from "@/utils/supabase/server";
import { getBusinessLoyaltyRewards, getBusinessLoyaltySettings } from "@/lib/business-loyalty/service";


export default  async function BusinessSettingPage({ params }: { params: Promise<{ Id: string }> }){
    const { Id } = await params;

    const lang =await getLang() as LangType;
    const supabase = await createClient();
    const businesResponse =  await supabase.from('businesses').select('*').eq('id', Number(Id))
    console.log(businesResponse)
    const business =  businesResponse.data

    const t= DATA[lang]


    const [
 
  providerLinks,
  openingHours,
  loyaltySettings,
  rewards
] = await Promise.all([

 

  getBusinessProviderLinks(Number(Id)),

  getBusinessOpeningHours(Number(Id)),
  getBusinessLoyaltySettings(Number(Id)),
  getBusinessLoyaltyRewards(Number(Id))


])

return (

  <BusinessSettingsClient

    business={business}

    providerLinks={
      providerLinks?.data || []
    }
    loyaltySettings={loyaltySettings?.data || []}
    businessRewards={rewards?.data || []}
    openingHours={openingHours?.data || []}
    t={t}
    lang={lang}
    

  />

)
}
