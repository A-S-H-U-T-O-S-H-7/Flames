// utils/productVariations.js
export const PRODUCT_CATEGORIES = {
  CLOTHING: 'clothing',
  FOOTWEAR: 'footwear', 
  ELECTRONICS: 'electronics',
  JEWELRY: 'jewelry',
  BAGS: 'bags',
  ACCESSORIES: 'accessories',
  HOME: 'home',
  BEAUTY: 'beauty',
  OTHER: 'other'
}

export const SIZE_SYSTEMS = {
  STANDARD: 'standard',     // XS, S, M, L, XL
  NUMERIC: 'numeric',       // 6, 7, 8, 9, 10
  ALPHABETIC: 'alphabetic', // A, B, C, D
  CUSTOM: 'custom'
}

export const SIZE_TEMPLATES = {
  [PRODUCT_CATEGORIES.CLOTHING]: {
    type: PRODUCT_CATEGORIES.CLOTHING,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    system: SIZE_SYSTEMS.STANDARD,
    colors: ['black', 'white', 'navy', 'gray', 'red', 'blue', 'green', 'pink', 'purple', 'yellow', 'orange', 'brown']
  },
  [PRODUCT_CATEGORIES.FOOTWEAR]: {
    type: PRODUCT_CATEGORIES.FOOTWEAR,
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    system: SIZE_SYSTEMS.NUMERIC,
    colors: ['black', 'white', 'brown', 'navy', 'red', 'blue', 'gray', 'green']
  },
  [PRODUCT_CATEGORIES.JEWELRY]: {
    type: PRODUCT_CATEGORIES.JEWELRY,
    sizes: ['Small', 'Medium', 'Large', 'One Size'],
    system: SIZE_SYSTEMS.STANDARD,
    colors: ['gold', 'silver', 'rose-gold', 'platinum', 'black', 'white']
  },
  [PRODUCT_CATEGORIES.BAGS]: {
    type: PRODUCT_CATEGORIES.BAGS,
    sizes: ['Small', 'Medium', 'Large'],
    system: SIZE_SYSTEMS.STANDARD,
    colors: ['black', 'brown', 'navy', 'red', 'green', 'blue', 'gray', 'beige']
  },
  [PRODUCT_CATEGORIES.ELECTRONICS]: {
    type: PRODUCT_CATEGORIES.ELECTRONICS,
    sizes: ['Standard'],
    system: SIZE_SYSTEMS.STANDARD,
    colors: ['black', 'white', 'silver', 'gray', 'blue', 'red']
  },
  [PRODUCT_CATEGORIES.OTHER]: {
    type: PRODUCT_CATEGORIES.OTHER,
    sizes: ['One Size'],
    system: SIZE_SYSTEMS.STANDARD,
    colors: ['black', 'white', 'red', 'blue', 'green', 'yellow']
  }
}

// Get category template
export const getCategoryTemplate = (category) => {
  return SIZE_TEMPLATES[category] || SIZE_TEMPLATES[PRODUCT_CATEGORIES.OTHER]
}

// Generate variations based on sizes and colors
export const generateVariations = (sizes, colors, basePrice, baseSalePrice) => {
  const variations = []
  
  sizes.forEach(size => {
    colors.forEach(color => {
      variations.push({
        id: `${size}-${color}-${Date.now()}`,
        size,
        color,
        sku: '',
        price: basePrice || 0,
        salePrice: baseSalePrice || 0,
        stock: 0,
        images: [],
        barcode: '',
        status: 'active'
      })
    })
  })
  
  return variations
}

// Calculate total stock from all variations
export const calculateTotalStock = (variations) => {
  return variations.reduce((total, variation) => total + (variation.stock || 0), 0)
}

// Get available sizes for a category
export const getAvailableSizes = (category) => {
  const template = getCategoryTemplate(category)
  return template ? template.sizes : []
}

// Get available colors for a category
export const getAvailableColors = (category) => {
  const template = getCategoryTemplate(category)
  return template ? template.colors : []
}

// Validate variation data
export const validateVariations = (variations) => {
  const errors = []
  
  variations.forEach((variation, index) => {
    if (!variation.size) {
      errors.push(`Variation ${index + 1}: Size is required`)
    }
    if (!variation.color) {
      errors.push(`Variation ${index + 1}: Color is required`)
    }
    if (variation.stock < 0) {
      errors.push(`Variation ${index + 1}: Stock cannot be negative`)
    }
    if (variation.price < 0) {
      errors.push(`Variation ${index + 1}: Price cannot be negative`)
    }
  })
  
  return errors
}

// Generate SKU for variation
export const generateVariationSKU = (baseSKU, size, color) => {
  const sizeCode = size.replace(/\s+/g, '').toUpperCase()
  const colorCode = color.replace(/\s+/g, '').toUpperCase().substring(0, 3)
  return `${baseSKU}-${sizeCode}-${colorCode}`
}

// Check if category requires variations
export const categoryRequiresVariations = (category) => {
  const noVariationCategories = [PRODUCT_CATEGORIES.ELECTRONICS, PRODUCT_CATEGORIES.OTHER]
  return !noVariationCategories.includes(category)
}

// Get size system for category
export const getSizeSystem = (category) => {
  const template = getCategoryTemplate(category)
  return template ? template.system : SIZE_SYSTEMS.STANDARD
}

export default {
  PRODUCT_CATEGORIES,
  SIZE_SYSTEMS,
  SIZE_TEMPLATES,
  getCategoryTemplate,
  generateVariations,
  calculateTotalStock,
  getAvailableSizes,
  getAvailableColors,
  validateVariations,
  generateVariationSKU,
  categoryRequiresVariations,
  getSizeSystem
}