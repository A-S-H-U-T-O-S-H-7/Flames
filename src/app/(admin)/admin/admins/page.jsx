import React from 'react'
import Form from '@/components/Admin/admins/Form'
import ListView from '@/components/Admin/admins/ListView'

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


