// components/seller/products/ProductDescription.jsx - UPDATED (Compact)
'use client'

import dynamic from 'next/dynamic'
import 'suneditor/dist/css/suneditor.min.css'

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false })

export default function ProductDescription({ description, onChange }) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        Product Description <span className="text-red-500">*</span>
      </label>
      
      <div className="border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden">
        <SunEditor
          onChange={onChange}
          setContents={description}
          setOptions={{
            buttonList: [
              ['undo', 'redo'],
              ['bold', 'italic', 'underline', 'strike'],
              ['fontSize', 'formatBlock'],
              ['fontColor', 'hiliteColor'],
              ['align', 'list'],
              ['link', 'image'],
              ['removeFormat'],
              ['preview']
            ],
            minHeight: '200px',
            height: 'auto',
            placeholder: 'Describe your product in detail...',
            defaultStyle: `
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 14px;
              line-height: 1.6;
              padding: 12px;
            `,
          }}
        />
      </div>
    </div>
  )
}