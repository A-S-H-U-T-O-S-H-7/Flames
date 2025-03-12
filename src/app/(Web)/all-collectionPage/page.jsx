import React from 'react'
import { getCollections } from '@/lib/firestore/collections/read_server'
import AllCollection from '@/components/Collection/AllCollection'


export default async function page() {
    const collections = await getCollections()
    
  return (
    <div>
      <AllCollection  collections={collections}/>
    </div>
  )
}

