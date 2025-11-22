// components/seller/products/ImageManager.jsx - UPDATED
'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Star } from 'lucide-react'

export default function ImageManager({ formData, onFormDataChange }) {
  const [dragActive, setDragActive] = useState(false)
  const featureImageInputRef = useRef(null)
  const galleryInputRef = useRef(null)

  // Combine existing images with new uploaded images
  const allGalleryImages = [
    ...(formData.existingImages || []).map(url => ({ url, isExisting: true })),
    ...formData.imageList
  ]

  const handleFeatureImageChange = (files) => {
    if (files && files[0]) {
      const file = files[0]
      const imageUrl = URL.createObjectURL(file)
      onFormDataChange({
        ...formData,
        featureImage: file,
        existingFeatureImage: imageUrl
      })
    }
  }

  const handleGalleryImagesChange = (files) => {
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => ({
        file,
        url: URL.createObjectURL(file),
        isExisting: false
      }))
      
      onFormDataChange({
        ...formData,
        imageList: [...formData.imageList, ...newImages]
      })
    }
  }

  const removeFeatureImage = () => {
    onFormDataChange({
      ...formData,
      featureImage: null,
      existingFeatureImage: ''
    })
  }

  const removeGalleryImage = (index, isExisting) => {
    if (isExisting) {
      // Remove from existing images
      const updatedExisting = formData.existingImages.filter((_, i) => i !== index)
      onFormDataChange({
        ...formData,
        existingImages: updatedExisting
      })
    } else {
      // Remove from new images
      const updatedImages = formData.imageList.filter((_, i) => i !== index)
      onFormDataChange({
        ...formData,
        imageList: updatedImages
      })
    }
  }

  const setAsFeatureImage = (imageUrl, imageFile, isExisting) => {
    if (isExisting) {
      // For existing images, we'll need to re-upload if they want to change feature image
      onFormDataChange({
        ...formData,
        featureImage: null, // Clear any new feature image
        existingFeatureImage: imageUrl
      })
    } else {
      onFormDataChange({
        ...formData,
        featureImage: imageFile,
        existingFeatureImage: imageUrl
      })
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (type === 'feature') {
        handleFeatureImageChange(e.dataTransfer.files)
      } else {
        handleGalleryImagesChange(e.dataTransfer.files)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Feature Image */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Feature Image <span className="text-red-500">*</span>
        </label>
        
        <div
          className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
              : 'border-slate-300 dark:border-slate-600 hover:border-purple-500 dark:hover:border-purple-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e, 'feature')}
        >
          {(formData.existingFeatureImage || formData.featureImage) ? (
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={formData.existingFeatureImage || URL.createObjectURL(formData.featureImage)}
                  alt="Feature"
                  className="h-24 w-24 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={removeFeatureImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-1 left-1 flex items-center gap-1 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                  <Star size={10} />
                  Main
                </div>
              </div>
              <button
                type="button"
                onClick={() => featureImageInputRef.current?.click()}
                className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                Change Image
              </button>
            </div>
          ) : (
            <div 
              className="cursor-pointer py-4"
              onClick={() => featureImageInputRef.current?.click()}
            >
              <Upload className="mx-auto h-6 w-6 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Click to upload feature image
              </p>
            </div>
          )}
          
          <input
            ref={featureImageInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFeatureImageChange(e.target.files)}
          />
        </div>
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Gallery Images {allGalleryImages.length > 0 && `(${allGalleryImages.length})`}
        </label>

        <div
          className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 mb-4 ${
            dragActive 
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
              : 'border-slate-300 dark:border-slate-600 hover:border-purple-500 dark:hover:border-purple-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e, 'gallery')}
        >
          <div 
            className="text-center cursor-pointer py-4"
            onClick={() => galleryInputRef.current?.click()}
          >
            <Upload className="mx-auto h-6 w-6 text-slate-400 mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Click to upload gallery images
            </p>
          </div>
          
          <input
            ref={galleryInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => handleGalleryImagesChange(e.target.files)}
          />
        </div>

        {/* Gallery Preview */}
        {allGalleryImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {allGalleryImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={`Gallery ${index + 1}`}
                  className="h-16 w-full object-cover rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index, image.isExisting)}
                  className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                >
                  <X size={10} />
                </button>
                <button
                  type="button"
                  onClick={() => setAsFeatureImage(image.url, image.file, image.isExisting)}
                  className="absolute bottom-1 left-1 p-0.5 bg-slate-800/70 text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Set as feature image"
                >
                  <Star size={8} />
                </button>
                {image.isExisting && (
                  <div className="absolute top-1 right-1 p-0.5 bg-blue-500 text-white text-xs rounded">
                    Existing
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}