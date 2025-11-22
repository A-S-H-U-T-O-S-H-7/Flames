// components/sellers/products/SellerProductForm.jsx - FIXED
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Save, Package, Image, FileText, Layers, Settings, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'
import BasicProductDetails from './BasicProductDetails'
import VariationManager from './VariationManager'
import ImageManager from './ImageManager'
import ProductDescription from './ProductDescription'
import SellerSpecificDetails from './SellerSpecificDetails'
import { createSellerProduct, updateSellerProduct } from '@/lib/firestore/products/write'
import { useAuth } from '@/context/AuthContext'
import { useSeller } from '@/lib/firestore/sellers/read'
import { useProduct } from '@/lib/firestore/products/read'

export default function SellerProductForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const isEditMode = !!productId

  const { user } = useAuth() 
  const { data: seller, isLoading: sellerLoading } = useSeller({ email: user?.email })
  const sellerId = seller?.id

  const { data: existingProduct, isLoading: productLoading } = useProduct({ 
    productId, 
    sellerId: isEditMode ? sellerId : null 
  })

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    category: '',
    brandId: '',
    price: 0,
    salePrice: 0,
    stock: 0,
    sku: '',
    isFeatured: false,
    isNewArrival: false,
    description: '',
    sellerSku: '',
    handlingTime: 1,
    shippingProfile: 'standard',
    returnPolicy: 'seller',
    warranty: {
      hasWarranty: false,
      duration: 0,
      type: 'seller'
    },
    variations: [],
    featureImage: null,
    imageList: [],
    existingFeatureImage: '',
    existingImages: []
  })

  useEffect(() => {
    if (isEditMode && existingProduct) {
      setFormData({
        title: existingProduct.title || '',
        shortDescription: existingProduct.shortDescription || '',
        category: existingProduct.categoryId || existingProduct.category || '',
        brandId: existingProduct.brandId || '',
        price: existingProduct.price || 0,
        salePrice: existingProduct.salePrice || 0,
        stock: existingProduct.stock || 0,
        sku: existingProduct.sku || '',
        isFeatured: existingProduct.isFeatured || false,
        isNewArrival: existingProduct.isNewArrival || false,
        description: existingProduct.description || '',
        sellerSku: existingProduct.sellerSku || '',
        handlingTime: existingProduct.handlingTime || 1,
        shippingProfile: existingProduct.shippingProfile || 'standard',
        returnPolicy: existingProduct.returnPolicy || 'seller',
        warranty: existingProduct.warranty || { hasWarranty: false, duration: 0, type: 'seller' },
        variations: existingProduct.variations || [],
        featureImage: null,
        imageList: [],
        existingFeatureImage: existingProduct.featureImageURL || '',
        existingImages: existingProduct.imageList || []
      })
    }
  }, [isEditMode, existingProduct])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (parentField, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value
      }
    }))
  }

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      category,
      variations: []
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.title || !formData.shortDescription || !formData.category || !formData.brandId) {
        toast.error('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (!formData.featureImage && !formData.existingFeatureImage) {
        toast.error('Please upload a feature image')
        setLoading(false)
        return
      }

      const featureImageFile = formData.featureImage
      const galleryImageFiles = formData.imageList.map(img => img.file)

      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        salePrice: parseFloat(formData.salePrice) || 0,
        stock: parseInt(formData.stock) || 0,
        handlingTime: parseInt(formData.handlingTime) || 1,
        featureImage: undefined,
        imageList: undefined,
        existingFeatureImage: undefined,
        existingImages: undefined
      }

      if (isEditMode) {
        await updateSellerProduct({ 
          id: productId, 
          data: productData,
          featureImage: featureImageFile,
          imageList: galleryImageFiles,
          sellerId: sellerId 
        })
        toast.success('Product updated successfully!')
      } else {
        await createSellerProduct({ 
          data: productData,
          featureImage: featureImageFile,
          imageList: galleryImageFiles,
          sellerId: sellerId
        })
        toast.success('Product created successfully!')
      }

      router.push('/sellers/products')
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(`Error saving product: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/sellers/products')
  }

  if (sellerLoading || (isEditMode && productLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="ml-[110px] py-4 mr-[40px]">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all duration-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
                <Sparkles size={16} className="text-teal-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isEditMode ? 'Editing Product' : 'New Product'}
                </span>
              </div>
              
              <button
                type="submit"
                form="product-form"
                disabled={loading}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold hover:scale-105"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Save size={20} />
                )}
                {isEditMode ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-teal-600 dark:from-white dark:to-teal-400 bg-clip-text text-transparent">
              {isEditMode ? 'Edit Product' : 'Create New Product'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg">
              {isEditMode ? 'Update your product information' : 'Fill in the details to list your product'}
            </p>
          </div>
        </div>

        <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg">
                  <Package className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Basic Information</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Essential details about your product</p>
                </div>
              </div>
              <BasicProductDetails
                formData={formData}
                onInputChange={handleInputChange}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Settings className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Seller Settings</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Configure your selling preferences</p>
                </div>
              </div>
              <SellerSpecificDetails
                formData={formData}
                onInputChange={handleInputChange}
                onNestedChange={handleNestedChange}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Image className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Product Images</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Upload your product photos</p>
                </div>
              </div>
              <ImageManager
                formData={formData}
                onFormDataChange={setFormData}
              />
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
                  <FileText className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Description</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Describe your product</p>
                </div>
              </div>
              <ProductDescription
                description={formData.description}
                onChange={(value) => handleInputChange('description', value)}
              />
            </div>

            {formData.category && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <Layers className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Variations</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Manage sizes & colors</p>
                  </div>
                </div>
                <VariationManager
                  formData={formData}
                  onFormDataChange={setFormData}
                />
              </div>
            )}
          </div>
<div className="lg:col-span-2">
  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          Ready to {isEditMode ? 'Update' : 'Create'}?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Review your product details before submitting
        </p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold hover:scale-105 min-w-[200px] justify-center"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <Save size={20} />
        )}
        {isEditMode ? 'Update Product' : 'Create Product'}
      </button>
    </div>
  </div>
</div>
        </form>

        <div className="fixed bottom-6 left-6 right-6 xl:hidden">
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-2xl font-bold text-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save size={24} />
                {isEditMode ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}