import React, { useState } from 'react';
import { useField } from 'formik';
import { Upload, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';

const FileUploadField = ({ 
  label, 
  icon: Icon, 
  accept,
  ...props 
}) => {
  const [field, meta, helpers] = useField(props);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');
  const hasFile = Boolean(field.value);

  const validateFile = (file) => {
    if (!file) return null;
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and PDF files are allowed';
    }
    
    return null;
  };

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    const error = validateFile(file);
    
    if (error) {
      setValidationError(error);
      helpers.setValue(null);
    } else {
      setValidationError('');
      helpers.setValue(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    const error = validateFile(file);
    
    if (error) {
      setValidationError(error);
      helpers.setValue(null);
    } else {
      setValidationError('');
      helpers.setValue(file);
    }
  };

  const removeFile = () => {
    helpers.setValue(null);
    setValidationError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const displayError = validationError || (meta.touched && meta.error);

  return (
    <div 
      className={`rounded-xl p-4 border-2 border-dashed transition-all duration-200 ${
        dragOver
          ? 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-400 scale-102'
          : hasFile 
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400' 
          : displayError
          ? 'bg-red-50 border-red-300'
          : 'bg-gray-50 border-gray-300 hover:border-teal-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label className="cursor-pointer block">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className={`w-4 h-4 ${hasFile ? 'text-emerald-600' : 'text-teal-600'}`} />}
            <span className={`text-sm font-medium ${
              hasFile ? 'text-emerald-700' : displayError ? 'text-red-700' : 'text-gray-700'
            }`}>
              {label}
            </span>
          </div>
          {hasFile && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Uploaded</span>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 rounded-full hover:bg-red-100 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center py-3">
          <div className="text-center">
            {hasFile ? (
              <div className="flex items-center gap-2 text-emerald-600">
                <FileText className="w-6 h-6" />
                <div className="text-left">
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {field.value.name}
                  </p>
                  <p className="text-xs text-emerald-500">
                    {formatFileSize(field.value.size)}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Upload className={`w-8 h-8 mx-auto mb-1 ${
                  dragOver ? 'text-teal-500' : 'text-gray-400'
                }`} />
                <p className="text-xs text-gray-600">
                  {dragOver ? (
                    <span className="text-teal-600 font-medium">Drop your file here</span>
                  ) : (
                    <>
                      <span className="text-teal-600 font-medium">Click to upload</span> or drag and drop
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">PDF, JPG, PNG (Max 5MB)</p>
              </>
            )}
          </div>
        </div>

        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      
      {displayError && (
        <div className="flex items-center gap-1 mt-2 text-red-600 text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>{validationError || meta.error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadField;