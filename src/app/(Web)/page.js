import React from 'react'
import HeroBanner from '@/components/HeroBanner'
import Category from '@/components/CategoryCard'
import NewArrivalSection from '@/components/NewArrivalSection'
import GiftsSection from '@/components/HomeGiftSection'
import StateSection from '@/components/StateSection'
import InstaBanner from '@/components/InstaBanner'
import FeaturedCollection from '@/components/FeaturedCollection'
import FAQ from '@/components/FAQ'
import CustomerReviews from '@/components/CustomerReview'
import StatePage from '@/components/StateCard'


function Home() {
  return (
    <div>
      <HeroBanner/>
      <Category/>
      <NewArrivalSection/>
      <GiftsSection/>
      <StateSection/>
      <InstaBanner/>
      <FeaturedCollection/>
      <CustomerReviews/>
      <FAQ/>
    </div>
  )
}

export default Home
