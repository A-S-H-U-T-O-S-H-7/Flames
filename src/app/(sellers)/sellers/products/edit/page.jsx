// app/(sellers)/seller/products/edit/page.jsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SellerProductForm from '@/components/seller/Products/SellerProductForm'

export default function EditProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const [isSeller, setIsSeller] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setIsSeller(true)
      setLoading(false)
    } else {
      router.push('/seller/registration')
    }
  }, [user, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSeller) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Please log in as a seller to access this page.
          </p>
        </div>
      </div>
    )
  }

  return <SellerProductForm />
}