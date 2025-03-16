
import React from 'react'
import GiftsSection from '@/components/HomeGiftSection'
import InstaBanner from '@/components/InstaBanner'
import CustomerReviews from '@/components/CustomerReview'
import CategoryClientWrapper from '@/components/ClientCode/CategoryClientWrapper'
import BannersClientWrapper from '@/components/ClientCode/BannersClientWrapper'
import FaqsClientWrapper from '@/components/ClientCode/FaqsClientWrapper'
import ShowcasedCollectionsClientWrapper from '@/components/ClientCode/ShowcasedCollectionsClientWrapper'
import FeaturedClientWrapper from '@/components/ClientCode/FeaturedClientWrapper'
import NewArrivalClientWrapper from '@/components/ClientCode/NewArrivalClientWrapper'
import ShortService from '@/components/ShortService'

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
      <ShortService/>

    </div>
  )
}

