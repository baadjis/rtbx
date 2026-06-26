/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo, useState } from 'react'

import ProviderCard from '../providers/providerCard'
import ProviderModal from '../providers/ProviderModal'
import ReviewsSection from './ReviewsSection'

import {
  getProviders
} from '@/utils/busines-types'
import ReviewProviderPickerModal from '../providers/ReviewProviderPickerModal'
import BookingSection from './BookingSection'
import BookingProviderPickerModal from '../providers/BookingProviderPickerModal'
import DeliverySection from './DeliverySection'
import DeliveryProviderPickerModal from '../providers/DeliveryProviderPickerModal'
import MarketplaceSection from './MarketplaceSection'
import MarketplaceProviderPickerModal from '../providers/MarketplaceProviderPickerModal'

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

  const providers =
    useMemo(
      () =>
        getProviders(
          business.business_type
        ),
      [
        business.business_type
      ]
    )

    const [

  reviewPickerOpen,

  setReviewPickerOpen

] = useState(false)

const [

  bookingPickerOpen,

  setBookingPickerOpen

] = useState(false)

const [

  deliveryPickerOpen,

  setDeliveryPickerOpen

] = useState(false)

const [

  marketplacePickerOpen,

  setMarketplacePickerOpen

] = useState(false)

function handleSelectReviewProvider(
  provider: any
) {

  setReviewPickerOpen(
    false
  )

  openProvider(
    provider,
    'review'
  )

}



  const [
    modalOpen,
    setModalOpen
  ] = useState(false)

  const [
    selectedProvider,
    setSelectedProvider
  ] = useState<any>(null)

  const [
    selectedCategory,
    setSelectedCategory
  ] = useState('')

  const [
    providerValue,
    setProviderValue
  ] = useState('')

  const [
    saving,
    setSaving
  ] = useState(false)


  const reviewLinks =
  links.filter(
    item =>
      item.provider_category ===
      'review'
  )

  const bookingLinks =
  links.filter(
    item =>
      item.provider_category ===
      'booking'
  )

  const deliveryLinks =
  links.filter(
    item =>
      item.provider_category ===
      'delivery'
  )


  const marketplaceLinks =
  links.filter(
    item =>
      item.provider_category ===
      'marketplace'
  )
  // =====================================================
  // OPEN MODAL
  // =====================================================

  function openProvider(

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

  }

  // =====================================================
  // SAVE
  // =====================================================

  async function handleSave() {

    if (
      !selectedProvider
    ) {
      return
    }

    setSaving(true)

    try {

      await onSave({

        provider_category:
          selectedCategory,

        provider_id:
          selectedProvider.id,

        value:
          providerValue

      })

      setModalOpen(false)

    } finally {

      setSaving(false)

    }

  }


  function handleSelectBookingProvider(
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

}

  // =====================================================
  // CATEGORY
  // =====================================================

  function renderCategory(

    title: string,

    category: string,

    items: any[]

  ) {

    if (
      !items?.length
    ) {
      return null
    }

    return (

      <div className="space-y-4">

        <h3 className="
          text-xl
          font-black
          text-gray-900
          dark:text-white
        ">

          {title}

        </h3>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-4
        ">

          {items.map(
            (
              provider
            ) => {

              const link =
                links.find(

                  (
                    item
                  ) =>

                    item.provider_id ===
                    provider.id

                )

              return (

                <ProviderCard

                  key={
                    provider.id
                  }

                  category={
                    category
                  }

                  provider={
                    provider
                  }

                  link={
                    link
                  }

                  business={
                    business
                  }

                  t={t}

                  onClick={() =>
                    openProvider(

                      provider,

                      category

                    )
                  }

                />

              )

            }
          )}

        </div>

      </div>

    )

  }

  return (

    <>

      <div className="space-y-10">

        <ReviewsSection

  links={reviewLinks}

  t={t}

  onAdd={() =>

    setReviewPickerOpen(
      true
    )

  }

/>

<BookingSection

  links={
    bookingLinks
  }

  t={t}

  onAdd={() =>

    setBookingPickerOpen(
      true
    )

  }

/>

<DeliverySection

  links={deliveryLinks}

  t={t}

  onAdd={() =>

    setDeliveryPickerOpen(
      true
    )

  }

/>
       
<MarketplaceSection

  links={marketplaceLinks}

  t={t}

  onAdd={() =>

    setMarketplacePickerOpen(
      true
    )

  }

/>

      </div>

      <ProviderModal

        open={modalOpen}

        provider={
          selectedProvider
        }

        value={
          providerValue
        }

        onChange={
          setProviderValue
        }

        loading={saving}

        t={t}

        onClose={() =>
          setModalOpen(false)
        }

        onSave={
          handleSave
        }

      />


      <ReviewProviderPickerModal

  open={
    reviewPickerOpen
  }

  providers={
    providers.reviews
  }

  t={t}

  onClose={() =>

    setReviewPickerOpen(
      false
    )

  }

  onSelect={
    handleSelectReviewProvider
  }

/>

<BookingProviderPickerModal

  open={
    bookingPickerOpen
  }

  providers={
    providers.bookings
  }

  t={t}

  onClose={() =>

    setBookingPickerOpen(
      false
    )

  }

  onSelect={
    handleSelectBookingProvider
  }

/>

<DeliveryProviderPickerModal

  open={
    deliveryPickerOpen
  }

  providers={
    providers.delivery
  }

  t={t}

  onClose={() =>

    setDeliveryPickerOpen(
      false
    )

  }

  onSelect={
    handleSelectDeliveryProvider
  }

/>


<MarketplaceProviderPickerModal

  open={
    marketplacePickerOpen
  }

  providers={
    providers.marketplaces
  }

  t={t}

  onClose={() =>

    setMarketplacePickerOpen(
      false
    )

  }

  onSelect={
    handleSelectMarketplaceProvider
  }

/>

    </>

  )

}