// components/sellers/products/SellerProductList.jsx - UPDATED
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter } from 'lucide-react'
import Swal from 'sweetalert2'
import ProductTable from './SellerProductTable'
import ProductFilters from './ProductFilters'
import Pagination from '../Pangination'
import { useSellerProducts } from '@/lib/firestore/products/read'
import { deleteSellerProduct } from '@/lib/firestore/products/write'
import { useAuth } from '@/context/AuthContext'
import { useSeller } from '@/lib/firestore/sellers/read'
import ProductViewModal from './ProductViewModal'

export default function SellerProductList() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    featured: 'all',
    newArrival: 'all',
    stock: 'all'
  })

  const { user } = useAuth() 
  const { data: seller, isLoading: sellerLoading } = useSeller({ email: user?.email })
  const sellerId = seller?.id
  const shouldFetchProducts = !!sellerId && !sellerLoading

  console.log('🔍 Seller data:', seller)
  console.log('🔍 Seller ID to use:', sellerId)


  const { data: products = [], isLoading: productsLoading, error } = useSellerProducts({ 
    sellerId: shouldFetchProducts ? sellerId : null, 
    pageLimit: 50
  })

// ADD THESE DEBUGGERS:
  console.log('🔍 SellerProductList Debug:')
  console.log('Seller ID:', sellerId)
  console.log('Products data:', products)
  console.log('Products length:', products?.length)
  console.log('Loading state:', productsLoading)
  console.log('Error:', error)

  console.log('🔍 SellerProductList state:', {
    sellerId,
    sellerLoading,
    shouldFetchProducts,
    productsCount: products.length,
    productsLoading
  })
  
  if (products?.length > 0) {
    console.log('First product sample:', products[0])
    console.log('Product fields:', Object.keys(products[0]))
  }

   if (sellerLoading || !sellerId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  // Filter products client-side (since Firestore doesn't support all filters)
  const filteredProducts = products
    .filter(product => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sellerSku?.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter (calculate based on stock)
      const productStatus = product.stock > 0 ? 'active' : 'out_of_stock'
      const matchesStatus = filters.status === 'all' || 
        productStatus === filters.status

      // Category filter
      const matchesCategory = filters.category === 'all' || 
        product.category === filters.category

      // Featured filter
      const matchesFeatured = filters.featured === 'all' || 
        (filters.featured === 'featured' && product.isFeatured) ||
        (filters.featured === 'not_featured' && !product.isFeatured)

      // New Arrival filter
      const matchesNewArrival = filters.newArrival === 'all' || 
        (filters.newArrival === 'new' && product.isNewArrival) ||
        (filters.newArrival === 'not_new' && !product.isNewArrival)

      // Stock filter
      const matchesStock = filters.stock === 'all' ||
        (filters.stock === 'in_stock' && product.stock > 0) ||
        (filters.stock === 'low_stock' && product.stock > 0 && product.stock < 10) ||
        (filters.stock === 'out_of_stock' && product.stock === 0)

      return matchesSearch && matchesStatus && matchesCategory && 
             matchesFeatured && matchesNewArrival && matchesStock
    })
    .sort((a, b) => {
      // Sort by creation date in descending order (newest first)
      const dateA = a.timestampCreate?.seconds || a.timestampCreate?.getTime?.() || 0
      const dateB = b.timestampCreate?.seconds || b.timestampCreate?.getTime?.() || 0
      return dateB - dateA
    })

  // Pagination
  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleEdit = (productId) => {
    router.push(`/sellers/products/edit?id=${productId}`)
  }

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b',
    })

    if (result.isConfirmed) {
      try {
        await deleteSellerProduct({ 
          id: productId, 
          sellerId: sellerId 
        })
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your product has been deleted.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b',
        })
      } catch (error) {
        console.error('Delete error:', error)
        Swal.fire({
          title: 'Error!',
          text: error.message || 'Failed to delete product.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b',
        })
      }
    }
  }

   const handleView = (productId) => {
    setSelectedProductId(productId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProductId(null)
  }

  const handleEditFromModal = (productId) => {
    handleCloseModal()
    handleEdit(productId)
  }

  const handleCreate = () => {
    router.push('/sellers/products/create')
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      featured: 'all',
      newArrival: 'all',
      stock: 'all'
    })
    setSearchTerm('')
    setCurrentPage(1)
  }

  // Show error if any
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Error loading products
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                My Products
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
                Manage your product listings and inventory
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm sm:text-base"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <ProductFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Products Table */}
        <div className="rounded-2xl shadow-2xl border-2 overflow-hidden bg-white dark:bg-slate-800 border-emerald-300 dark:border-emerald-600/50 shadow-emerald-500/10 dark:shadow-emerald-900/20">
          <ProductTable
            products={currentProducts}
            loading={productsLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </div>
         <ProductViewModal
        productId={selectedProductId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditFromModal}
      />
    </div>
  )
}
