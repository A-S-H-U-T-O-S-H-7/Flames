"use client";

import React from 'react';
import { ROLES, getRoleDisplayName, getRoleColor } from '@/lib/permissions/adminPermissions';

export default function RoleSelector({ selectedRole, onRoleChange, disabled = false, currentUserRole }) {
  // Super admins can assign any role, others can only assign roles equal or lower than theirs
  const getAvailableRoles = () => {
    if (currentUserRole === ROLES.SUPER_ADMIN) {
      return Object.values(ROLES);
    }
    return []; // Non-super admins cannot assign roles
  };

  const availableRoles = getAvailableRoles();

  if (availableRoles.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-gray-500 dark:text-[#888ea8] text-sm">
          Role <span className="text-red-500">*</span>
        </label>
        <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800">
          <span className="text-gray-500 dark:text-gray-400">You don't have permission to assign roles</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-500 dark:text-[#888ea8] text-sm">
        Role <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 gap-3">
        {availableRoles.map((role) => (
          <label
            key={role}
            className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200
              ${selectedRole === role 
                ? 'border-purple-500 dark:border-[#22c7d5] bg-purple-50 dark:bg-[#1e2737]' 
                : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-[#22c7d5]'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="radio"
              name="role"
              value={role}
              checked={selectedRole === role}
              onChange={(e) => onRoleChange(e.target.value)}
              disabled={disabled}
              className="hidden"
            />
            <div className="flex-1 flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${selectedRole === role 
                  ? 'border-purple-500 dark:border-[#22c7d5]' 
                  : 'border-gray-300 dark:border-gray-600'
                }
              `}>
                {selectedRole === role && (
                  <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-[#22c7d5]"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 dark:text-white">
                    {getRoleDisplayName(role)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(role)}`}>
                    {role}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {getRoleDescription(role)}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function getRoleDescription(role) {
  const descriptions = {
    [ROLES.SUPER_ADMIN]: 'Full access to all features and can manage other admins and their permissions',
    [ROLES.ADMIN]: 'Access to most features as assigned by super admin, cannot manage other admins',
    [ROLES.SELLER]: 'Limited access focused on product and order management as assigned by super admin'
  };
  return descriptions[role] || 'Unknown role';
}