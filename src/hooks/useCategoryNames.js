// hooks/useCategoryNames.js
import { useState, useEffect } from 'react'
import { useCategories } from '@/lib/firestore/categories/read'

export function useCategoryNames() {
  const { data: categories } = useCategories()
  const [categoryNames, setCategoryNames] = useState({})

  useEffect(() => {
    if (categories && categories.length > 0) {
      const namesMap = {}
      categories.forEach(cat => {
        namesMap[cat.id] = cat.name
      })
      setCategoryNames(namesMap)
    }
  }, [categories])

  const getCategoryName = (categoryId) => {
    return categoryNames[categoryId] || categoryId || 'Uncategorized'
  }

  return { getCategoryName, categoryNames }
}