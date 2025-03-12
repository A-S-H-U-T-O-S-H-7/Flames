import React from 'react'
import ListView from '@/components/Admin/banners/ListView'
import Form from '@/components/Admin/banners/Form'

export default function page() {
  return (
    <div >
       <main className="p-5  flex flex-col  gap-5">
      <Form />
      <ListView />
    </main>
      
    </div>
  )
}


