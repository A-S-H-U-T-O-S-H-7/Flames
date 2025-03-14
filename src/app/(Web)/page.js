
import React from 'react'
import BannersClientWrapper from "@/components/BannersClientWrapper";
import NewArrivalSection from '@/components/NewArrivalSection'
import GiftsSection from '@/components/HomeGiftSection'
import CollectionSection from '@/components/Collection/CollectionSection'
import InstaBanner from '@/components/InstaBanner'
import FeaturedCollection from '@/components/FeaturedCollection'
import FAQ from '@/components/FAQ'
import CustomerReviews from '@/components/CustomerReview'
import { getBanners } from '@/lib/firestore/banners/read_server'
import { getFeaturedProducts, getNewArrivalProducts } from '@/lib/firestore/products/read_server'
import { getShowcasedCollections } from '@/lib/firestore/collections/read_server'
import { getFaqs } from '@/lib/firestore/faqs/read_server'
import CategoryClientWrapper from '@/components/ClientCode/CategoryClientWrapper'


export default async function Home() {

const newArrivalProducts = await getNewArrivalProducts()
const featuredProducts = await getFeaturedProducts()
const showcasedCollections = await getShowcasedCollections()
const faqs = await getFaqs()


  return (
    <div>
<BannersClientWrapper />
<CategoryClientWrapper />
      <NewArrivalSection newArrivalProducts = {newArrivalProducts} />
      <GiftsSection/>
      <InstaBanner/>
      <CollectionSection showcasedCollections={showcasedCollections || []}/>
      <FeaturedCollection featuredProducts={featuredProducts}/>
      <CustomerReviews />
      <FAQ faqs={faqs}/>
    </div>
  )
}

