import React from 'react'
import Form from '@/components/Admin/collections/Form'
import ListView from '@/components/Admin/collections/ListView'

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


