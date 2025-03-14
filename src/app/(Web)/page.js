
import React from 'react'
import NewArrivalSection from '@/components/NewArrivalSection'
import GiftsSection from '@/components/HomeGiftSection'
import InstaBanner from '@/components/InstaBanner'
import FeaturedCollection from '@/components/FeaturedCollection'
import CustomerReviews from '@/components/CustomerReview'
import { getFeaturedProducts, getNewArrivalProducts } from '@/lib/firestore/products/read_server'
import CategoryClientWrapper from '@/components/ClientCode/CategoryClientWrapper'
import BannersClientWrapper from '@/components/ClientCode/BannersClientWrapper'
import FaqsClientWrapper from '@/components/ClientCode/FaqsClientWrapper'
import ShowcasedCollectionsClientWrapper from '@/components/ClientCode/ShowcasedCollectionsClientWrapper'


export default async function Home() {

const newArrivalProducts = await getNewArrivalProducts()
const featuredProducts = await getFeaturedProducts()


  return (
    <div>
<BannersClientWrapper />
<CategoryClientWrapper />
      <NewArrivalSection newArrivalProducts = {newArrivalProducts} />
      <GiftsSection/>
      <InstaBanner/>
      <ShowcasedCollectionsClientWrapper />
      <FeaturedCollection featuredProducts={featuredProducts}/>
      <CustomerReviews />
      <FaqsClientWrapper />

    </div>
  )
}

