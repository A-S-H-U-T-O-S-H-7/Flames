
import React from 'react'
import GiftsSection from '@/components/web/home/HomeGiftSection'
import InstaBanner from '@/components/web/home/InstaBanner'
import CustomerReviews from '@/components/web/home/CustomerReview'
import CategoryClientWrapper from '@/components/clientCode/CategoryClientWrapper'
import BannersClientWrapper from '@/components/clientCode/BannersClientWrapper'
import FaqsClientWrapper from '@/components/clientCode/FaqsClientWrapper'
import ShowcasedCollectionsClientWrapper from '@/components/clientCode/ShowcasedCollectionsClientWrapper'
import FeaturedClientWrapper from '@/components/clientCode/FeaturedClientWrapper'
import NewArrivalClientWrapper from '@/components/clientCode/NewArrivalClientWrapper'
import PremiumService from '@/components/web/home/ShortService'

export default async function Home() {

  return (
    <div>
      <BannersClientWrapper />
      <CategoryClientWrapper />
      <NewArrivalClientWrapper/>

      <GiftsSection/>  
      <InstaBanner/>

      <ShowcasedCollectionsClientWrapper />
      <FeaturedClientWrapper/>

      <CustomerReviews />

      <FaqsClientWrapper />
      <PremiumService/>

    </div>
  )
}

