// hooks/useBrandNames.js
import { useState, useEffect } from 'react'
import { useBrands } from '@/lib/firestore/brands/read'

export function useBrandNames() {
  const { data: brands } = useBrands()
  const [brandNames, setBrandNames] = useState({})

  useEffect(() => {
    if (brands && brands.length > 0) {
      const namesMap = {}
      brands.forEach(brand => {
        namesMap[brand.id] = brand.name
      })
      setBrandNames(namesMap)
    }
  }, [brands])

  const getBrandName = (brandId) => {
    return brandNames[brandId] || brandId || 'No Brand'
  }

  return { getBrandName, brandNames }
}