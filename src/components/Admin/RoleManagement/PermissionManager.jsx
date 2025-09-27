"use client";

import React, { useState, useEffect } from 'react';
import { ADMIN_PAGES, ROLES, DEFAULT_ROLE_PERMISSIONS } from '@/lib/permissions/adminPermissions';
import { FaHome, FaBox, FaTags, FaShoppingCart, FaUsers, FaThLarge, FaStar, FaCubes, FaQq, FaUserShield } from 'react-icons/fa';
import { VscFeedback } from "react-icons/vsc";
import { GalleryVertical } from 'lucide-react';

const iconMap = {
  FaHome: <FaHome />,
  FaBox: <FaBox />,
  FaTags: <FaTags />,
  FaShoppingCart: <FaShoppingCart />,
  FaUsers: <FaUsers />,
  FaThLarge: <FaThLarge />,
  FaStar: <FaStar />,
  VscFeedback: <VscFeedback />,
  FaCubes: <FaCubes />,
  FaQq: <FaQq />,
  GalleryVertical: <GalleryVertical size={16} />,
  FaUserShield: <FaUserShield />
};

export default function PermissionManager({ 
  selectedRole, 
  permissions, 
  onPermissionsChange, 
  disabled = false,
  currentUserRole 
}) {
  const [localPermissions, setLocalPermissions] = useState(permissions || []);

  useEffect(() => {
    setLocalPermissions(permissions || []);
  }, [permissions]);

  useEffect(() => {
    // When role changes, set default permissions for that role
    if (selectedRole && (!permissions || permissions.length === 0)) {
      const defaultPerms = DEFAULT_ROLE_PERMISSIONS[selectedRole] || [];
      setLocalPermissions(defaultPerms);
      onPermissionsChange(defaultPerms);
    }
  }, [selectedRole]);

  const handlePermissionToggle = (pageId) => {
    if (disabled) return;

    const newPermissions = localPermissions.includes(pageId)
      ? localPermissions.filter(p => p !== pageId)
      : [...localPermissions, pageId];
    
    setLocalPermissions(newPermissions);
    onPermissionsChange(newPermissions);
  };

  const handleSelectAll = () => {
    if (disabled) return;
    const allPageIds = ADMIN_PAGES.map(page => page.id);
    setLocalPermissions(allPageIds);
    onPermissionsChange(allPageIds);
  };

  const handleSelectNone = () => {
    if (disabled) return;
    setLocalPermissions([]);
    onPermissionsChange([]);
  };

  const handleSelectDefault = () => {
    if (disabled || !selectedRole) return;
    const defaultPerms = DEFAULT_ROLE_PERMISSIONS[selectedRole] || [];
    setLocalPermissions(defaultPerms);
    onPermissionsChange(defaultPerms);
  };

  // Only super admins can manage permissions
  if (currentUserRole !== ROLES.SUPER_ADMIN) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-gray-500 dark:text-[#888ea8] text-sm">
          Permissions
        </label>
        <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800">
          <span className="text-gray-500 dark:text-gray-400">
            Only super admins can manage permissions
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-gray-500 dark:text-[#888ea8] text-sm">
          Page Access Permissions
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={disabled}
            className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={handleSelectDefault}
            disabled={disabled || !selectedRole}
            className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Default
          </button>
          <button
            type="button"
            onClick={handleSelectNone}
            disabled={disabled}
            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select None
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ADMIN_PAGES.map((page) => {
          const isChecked = localPermissions.includes(page.id);
          
          return (
            <label
              key={page.id}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200
                ${isChecked 
                  ? 'border-purple-500 dark:border-[#22c7d5] bg-purple-50 dark:bg-[#1e2737]' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-[#22c7d5]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handlePermissionToggle(page.id)}
                disabled={disabled}
                className="hidden"
              />
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center
                  ${isChecked 
                    ? 'border-purple-500 dark:border-[#22c7d5] bg-purple-500 dark:bg-[#22c7d5]' 
                    : 'border-gray-300 dark:border-gray-600'
                  }
                `}>
                  {isChecked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
                
                <div className="text-purple-700 dark:text-[#22c7d5]">
                  {iconMap[page.icon] || <FaBox />}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-white">
                    {page.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {page.description}
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        <p><strong>Selected:</strong> {localPermissions.length} of {ADMIN_PAGES.length} pages</p>
        {selectedRole && (
          <p><strong>Default for {selectedRole}:</strong> {DEFAULT_ROLE_PERMISSIONS[selectedRole]?.length || 0} pages</p>
        )}
      </div>
    </div>
  );
}