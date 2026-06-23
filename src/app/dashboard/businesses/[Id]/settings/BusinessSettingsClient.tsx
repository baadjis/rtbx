/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'

import {
  Save,
  Settings
} from 'lucide-react'

import BusinessInformationSection
from './sections/BusinessInformationSection'

import ContactSection
from './sections/ContactSection'

import LocationSection
from './sections/LocationSection'

import ProvidersSection
from './sections/ProvidersSection'
import { LangType } from '@/lib/lang/types'
import OpeningHoursSection from './sections/OpeningHoursSection'
import { DEFAULT_OPENING_HOURS } from '@/lib/business-opening-hours/days'
import RewardModal from './RewardModal'
import LoyaltySettingsSection from './sections/LoyaltySettingsSection'
import RewardsSection from './sections/RewardsSection'
import LoyaltySettingsModal from './LoyaltySettingsModal'
import BusinessDangerSection from './sections/BusinessDangerSection'

type Props = {

  business: any

  providerLinks: any[]

  openingHours: any[]

  loyaltySettings: any

  businessRewards: any[]

  t: any

  lang: LangType

}

export default function BusinessSettingsClient({

  business,
  providerLinks,
  openingHours,
  t,
  lang,
  loyaltySettings,
  businessRewards

}: Props) {

  const [hours,setHours] =
  useState(

    openingHours?.length

      ? openingHours

      : DEFAULT_OPENING_HOURS

  )

  const [loyaltyForm,setLoyaltyForm] =
useState({

  enabled:
    loyaltySettings?.enabled ?? true,

  points_per_visit:
    loyaltySettings?.points_per_visit ?? 1,

  welcome_bonus_points:
    loyaltySettings?.welcome_bonus_points ?? 0

})

const [rewardModalOpen,setRewardModalOpen] =
useState(false)

const [loyaltyModalOpen,setLoyaltyModalOpen] =
useState(false)
const [selectedReward,setSelectedReward] =
useState<any>(null)

const [rewards,setRewards] =
useState(businessRewards)
 
  const [form, setForm] =
    useState({

      name:
        business.name || '',

      business_type:
        business.business_type || '',

      description:
        business.description || '',

      email:
        business.email || '',

      phone:
        business.phone || '',

      website:
        business.website || '',

      address:
        business.address || '',

      city:
        business.city || '',

      postal_code:
        business.postal_code || '',

      country:
  business.country || '',

country_code:
  business.country_code || 'FR',

      avatar_url:
        business.avatar_url || '',

      theme_color:
        business.theme_color || '#4f46e5'

    })

  const [loading, setLoading] =
    useState(false)

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave =
  async () => {

    try {

      setLoading(true)

      // BUSINESS

      const response =
        await fetch(

          `/api/businesses/${business.id}`,

          {

            method: 'PATCH',

            headers: {

              'Content-Type':
                'application/json'

            },

            body:
              JSON.stringify(
                form
              )

          }

        )

      const result =
        await response.json()

      if (!result.success) {

        alert(
          result.error
        )

        return

      }

      // OPENING HOURS

      await fetch(

        `/api/businesses/${business.id}/opening-hours`,

        {

          method: 'PUT',

          headers: {

            'Content-Type':
              'application/json'

          },

          body:
            JSON.stringify({

              hours

            })

        }

      )

      alert(
        t.saved
      )

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }

  }


    const handleSaveProvider =
  async (data: {

    provider_category: string

    provider_id: string

    value: string

  }) => {

    await fetch(

      `/api/businesses/${business.id}/provider-links`,

      {

        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify(
            data
          )

      }

    )

  }


const handleSaveLoyaltySettings =
async () => {

  await fetch(

    `/api/businesses/${business.id}/loyalty-settings`,

    {

      method:'PUT',

      headers:{
        'Content-Type':
          'application/json'
      },

      body:
        JSON.stringify(
          loyaltyForm
        )

    }

  )

  setLoyaltyForm({

  enabled:
    loyaltySettings?.enabled ?? true,

  points_per_visit:
    loyaltySettings?.points_per_visit ?? 1,

  welcome_bonus_points:
    loyaltySettings?.welcome_bonus_points ?? 0

})

}

const handleSaveReward =
async (data:any) => {

  if (
    selectedReward
  ) {

    const response =
      await fetch(

        `/api/businesses/${business.id}/loyalty-rewards/${selectedReward.id}`,

        {

          method:'PUT',

          headers:{
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(
              data
            )

        }

      )

    const result =
      await response.json()

    if (
      result.success
    ) {

      setRewards(

        rewards.map(
          item =>

            item.id ===
            selectedReward.id

              ? result.data

              : item
        )

      )

    }

  } else {

    const response =
      await fetch(

        `/api/businesses/${business.id}/loyalty-rewards`,

        {

          method:'POST',

          headers:{
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(
              data
            )

        }

      )

    const result =
      await response.json()

    if (
      result.success
    ) {

      setRewards(

        [
          result.data,
          ...rewards
        ]

      )

    }

  }

}


const handleDeleteReward =
async (reward:any) => {

  if (

    !confirm(
      t.delete_reward
    )

  ) return

  await fetch(

    `/api/businesses/${business.id}/loyalty-rewards/${reward.id}`,

    {

      method:'DELETE'

    }

  )

  setRewards(

    rewards.filter(

      (item:any) =>

        item.id !==
        reward.id

    )

  )

}

const handleDeleteBusiness =
async () => {

  const confirmed =
    window.confirm(
      t.delete_business_confirm
    )

  if (!confirmed)
    return

  const response =
    await fetch(

      `/api/businesses/${business.id}`,

      {

        method:'DELETE'

      }

    )

  const result =
    await response.json()

  if (!result.success) {

    alert(
      result.error
    )

    return

  }

  window.location.href =
    '/dashboard/businesses'

}

  return (

    <div className="
      max-w-7xl
      mx-auto
      px-4 md:px-6
      py-8
      space-y-8
    ">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="
        bg-white dark:bg-slate-900
        border border-gray-100
        dark:border-slate-800
        rounded-[3rem]
        p-8 md:p-10
        shadow-sm
      ">

        <div className="
          flex items-center
          gap-4
        ">

          <div className="
            w-14 h-14
            rounded-2xl
            bg-indigo-600
            text-white
            flex items-center
            justify-center
          ">

            <Settings size={24} />

          </div>

          <div>

            <h1 className="
              text-3xl md:text-4xl
              font-black
              text-gray-900
              dark:text-white
            ">

              {t.settings}

            </h1>

            <p className="
              text-gray-500
              dark:text-slate-400
              mt-1
            ">

              {t.manage_business_settings}

            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          BUSINESS
      ===================================================== */}

      <BusinessInformationSection

        form={form}

        setForm={setForm}

        t={t}
        lang={lang}

      />

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <ContactSection

        form={form}

        setForm={setForm}

        t={t}
    

      />

      {/* =====================================================
          LOCATION
      ===================================================== */}

      <LocationSection

        form={form}

        setForm={setForm}

        t={t}
    

      />

      {/* =====================================================
          PROVIDERS
      ===================================================== */}

      <ProvidersSection

        business={business}

        links={
          providerLinks
        }
      
        t={t}
        onSave={handleSaveProvider}

      />

      <OpeningHoursSection lang={lang} hours={hours} setHours={setHours}/>

      <LoyaltySettingsSection

  form={loyaltyForm}

 
  onEdit={() =>

    setLoyaltyModalOpen(
      true
    )

  }

  t={t}

/>

<RewardsSection

  rewards={rewards}

  t={t}

  onCreate={() => {

    setSelectedReward(
      null
    )

    setRewardModalOpen(
      true
    )

  }}

  onEdit={(reward:any) => {

    setSelectedReward(
      reward
    )

    setRewardModalOpen(
      true
    )

  }}

  onDelete={
    handleDeleteReward
  }

/>



      {/* =====================================================
          SAVE
      ===================================================== */}

      <button

        onClick={
          handleSave
        }

        disabled={
          loading
        }

        className="
          w-full
          py-5
          rounded-[2rem]
          bg-indigo-600
          hover:bg-indigo-700
          text-white
          font-black
          text-lg
          border-none
          cursor-pointer
          flex items-center
          justify-center
          gap-3
          shadow-xl
          shadow-indigo-200
          transition-all
        "

      >

        <Save size={20} />

        {

          loading

            ? t.saving

            : t.save_changes

        }

      </button>


      <BusinessDangerSection

  t={t}

  onDelete={
    handleDeleteBusiness
  }

/>


      <RewardModal

  open={
    rewardModalOpen
  }

  reward={
    selectedReward
  }

  t={t}

  onClose={() => {

    setRewardModalOpen(
      false
    )

    setSelectedReward(
      null
    )

  }}

  onSave={
    handleSaveReward
  }

/>





<LoyaltySettingsModal

  open={
    loyaltyModalOpen
  }

  settings={
    loyaltyForm
  }

  t={t}

  onClose={() =>

    setLoyaltyModalOpen(
      false
    )

  }

  onSave={
    handleSaveLoyaltySettings
  }

/>




    </div>

  )

}