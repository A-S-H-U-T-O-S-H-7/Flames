"use client";

import { FileText } from 'lucide-react';

export default function DocumentsSection({ documents }) {
  const docEntries = Object.entries(documents || {}).filter(([key]) => key !== 'profileImage');

  const getDocIcon = (fileName) => {
    if (!fileName) return FileText;
    if (fileName.includes('.pdf')) return FileText;
    if (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.jpeg')) return FileText;
    return FileText;
  };

  const formatDocType = (type) => {
    return type
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleView = (doc) => {
    if (doc.url) {
      window.open(doc.url, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Uploaded Documents</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {docEntries.length > 0 ? (
          docEntries.map(([docType, doc]) => {
            const DocIcon = getDocIcon(doc?.fileName);
            
            return (
              <div 
                key={docType}
                className="flex flex-col p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group border border-slate-200 dark:border-slate-600 h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-600 shadow-sm border border-slate-200 dark:border-slate-500">
                    <DocIcon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {formatDocType(docType)}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 mb-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 truncate">
                    {doc?.fileName || 'Unknown'}
                  </div>
                  {doc?.size && (
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {formatFileSize(doc.size)}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => handleView(doc)}
                  className="w-full py-2 px-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>View</span>
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8 text-slate-400 dark:text-slate-500">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No documents uploaded yet</p>
            <p className="text-sm mt-1">Upload your documents to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}