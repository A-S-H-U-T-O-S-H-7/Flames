
import React from 'react'
import HeroBanner from '@/components/HeroBanner'
import NewArrivalSection from '@/components/NewArrivalSection'
import GiftsSection from '@/components/HomeGiftSection'
import CollectionSection from '@/components/Collection/CollectionSection'
import InstaBanner from '@/components/InstaBanner'
import FeaturedCollection from '@/components/FeaturedCollection'
import FAQ from '@/components/FAQ'
import Category from '@/components/CategoryCard'
import CustomerReviews from '@/components/CustomerReview'
import { getBanners } from '@/lib/firestore/banners/read_server'
import { getCategories } from '@/lib/firestore/categories/read_server'
import { getFeaturedProducts, getNewArrivalProducts } from '@/lib/firestore/products/read_server'
import { getCollections } from '@/lib/firestore/collections/read_server'
import { getShowcasedCollections } from '@/lib/firestore/collections/read_server'
import { getFaqs } from '@/lib/firestore/faqs/read_server'
import CategoryClientWrapper from '@/components/CategoryClientWrapper'


export default async function Home() {

const banners = await getBanners()
const newArrivalProducts = await getNewArrivalProducts()
const featuredProducts = await getFeaturedProducts()
const showcasedCollections = await getShowcasedCollections()
const faqs = await getFaqs()


  return (
    <div>
      <HeroBanner banners={banners} />
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

