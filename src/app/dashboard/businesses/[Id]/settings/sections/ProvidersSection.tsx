/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo, useState } from 'react'


import ProviderModal from '../providers/ProviderModal'


import {
  getProviders
} from '@/utils/busines-types'

import ProviderCategorySection from './ProviderCategorySection'

type Props = {

  business: any

  links: any[]

  t: any

  onSave: (params: {

    provider_category: string

    provider_id: string

    value: string

  }) => Promise<void>

}

export default function ProvidersSection({

  business,

  links,

  t,

  onSave

}: Props) {

const [

  modalOpen,

  setModalOpen

] = useState(false)

const [

  selectedCategory,

  setSelectedCategory

] = useState('')

const [

  selectedProviders,

  setSelectedProviders

] = useState<any[]>([])

const [

  saving,

  setSaving

] = useState(false)

const modalConfig = {

  review: {

    title:
      t.review_providers,

    description:
      t.review_providers_description

  },

  booking: {

    title:
      t.booking_providers,

    description:
      t.booking_providers_description

  },

  delivery: {

    title:
      t.delivery_providers,

    description:
      t.delivery_providers_description

  },

  marketplace: {

    title:
      t.marketplace_providers,

    description:
      t.marketplace_providers_description

  }

}[selectedCategory]

const providers = useMemo(

  () =>

    getProviders(
      business.business_type
    ),

  [

    business.business_type

  ]

)
 
  // =====================================================
  // OPEN MODAL
  // =====================================================

  /*function openProvider(

    provider: any,

    category: string

  ) {

    const existingLink =
      links.find(

        (item) =>

          item.provider_id ===
          provider.id

      )

    setSelectedProvider(
      provider
    )

    setSelectedCategory(
      category
    )

    setProviderValue(

      existingLink?.value ||

      ''

    )

    setModalOpen(true)

  }*/

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async (

  values: {

    provider_id: string

    value: string

  }[]

) => {

  try {

    setSaving(true)

    for (const item of values) {

      await onSave({

        provider_category:
          selectedCategory,

        provider_id:
          item.provider_id,

        value:
          item.value

      })

    }

    setModalOpen(false)

  }

  finally {

    setSaving(false)

  }

}


 /* function handleSelectBookingProvider(
  provider: any
) {

  setBookingPickerOpen(
    false
  )

  openProvider(
    provider,
    'booking'
  )

}

function handleSelectDeliveryProvider(
  provider: any
) {

  setDeliveryPickerOpen(
    false
  )

  openProvider(
    provider,
    'delivery'
  )

}

function handleSelectMarketplaceProvider(
  provider: any
) {

  setMarketplacePickerOpen(
    false
  )

  openProvider(
    provider,
    'marketplace'
  )

}*/

  // =====================================================
  // CATEGORY
  // =====================================================

  

  return (

    <>

      <div className="space-y-10">

       <ProviderCategorySection

  title={t.review_providers}

  description={t.review_providers_description}

  category="review"

  providers={providers.reviews}

  links={links}

  business={business}

  t={t}

  onEdit={() => {

    setSelectedCategory('review')

    setSelectedProviders(
      providers.reviews
    )

    setModalOpen(true)

  }}

/>
<ProviderCategorySection

  title={t.booking_providers}

  description={t.booking_providers_description}

  category="booking"

  providers={providers.bookings}

  links={links}

  business={business}

  t={t}

  onEdit={() => {

    setSelectedCategory('booking')

    setSelectedProviders(
      providers.bookings
    )

    setModalOpen(true)

  }}

/>
<ProviderCategorySection

  title={t.delivery_providers}

  description={t.delivery_providers_description}

  category="delivery"

  providers={providers.delivery}

  links={links}

  business={business}

  t={t}

  onEdit={() => {

    setSelectedCategory('delivery')

    setSelectedProviders(
      providers.delivery
    )

    setModalOpen(true)

  }}

/>
<ProviderCategorySection

  title={t.marketplace_providers}

  description={t.marketplace_providers_description}

  category="marketplace"

  providers={providers.marketplaces}

  links={links}

  business={business}

  t={t}

  onEdit={() => {

    setSelectedCategory('marketplace')

    setSelectedProviders(
      providers.marketplaces
    )

    setModalOpen(true)

  }}

/>

      </div>

     <ProviderModal

  open={modalOpen}

  title={
    modalConfig?.title ?? ''
  }

  description={
    modalConfig?.description ?? ''
  }

  category={
    selectedCategory
  }

  providers={
    selectedProviders
  }

  links={links}

  loading={saving}

  t={t}

  onClose={() =>
    setModalOpen(false)
  }

  onSave={handleSave}

/>

      

    </>

  )

}