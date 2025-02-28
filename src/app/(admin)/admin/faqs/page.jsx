import React from 'react'
import ListView from '@/components/Admin/faqs/ListView'
import Form from '@/components/Admin/faqs/Form'
export default function page() {
  return (
    <div >
       <main className="p-5  flex flex-col md:flex-row gap-5">
      <Form />
      <ListView />
    </main>
      
    </div>
  )
}


