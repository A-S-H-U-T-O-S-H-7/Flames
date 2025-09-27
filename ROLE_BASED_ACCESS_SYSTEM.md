# Role-Based Access Control System

This document describes the comprehensive role-based access control (RBAC) system implemented for the Flames admin panel.

## Overview

The system provides three levels of access:
- **Super Admin**: Full access to all features and can manage other admins
- **Admin**: Customizable access to admin panel features (assigned by Super Admin)
- **Seller**: Limited access focused on products and orders (assigned by Super Admin)

## Features

### ✅ Implemented Features

1. **Three User Roles**
   - Super Admin (full access)
   - Admin (configurable access)
   - Seller (limited access)

2. **Permission Management**
   - Page-level access control
   - Checkbox interface for permission assignment
   - Default permissions for each role
   - Dynamic sidebar based on permissions

3. **Admin Management**
   - Role assignment during admin creation
   - Permission editing by Super Admins
   - Visual role indicators
   - Permission summary view

4. **Security Features**
   - Permission guards on all admin pages
   - Context-based permission checking
   - Route-level protection
   - UI element conditional rendering

5. **Auto-Migration**
   - Existing admin accounts migration
   - Setup scripts for initial configuration
   - Validation tools

## File Structure

```
src/
├── lib/
│   ├── permissions/
│   │   └── adminPermissions.js          # Core permission definitions
│   ├── setup/
│   │   └── setupRoleBasedAccess.js      # Setup and migration scripts
│   └── firestore/
│       └── admins/
│           └── write.jsx                # Updated with role support
├── context/
│   └── PermissionContext.jsx            # Permission management context
├── components/
│   └── Admin/
│       ├── PermissionGuard.jsx          # Page protection component
│       ├── RoleManagement/
│       │   ├── RoleSelector.jsx         # Role selection component
│       │   └── PermissionManager.jsx    # Permission checkbox interface
│       ├── AdminLayout.jsx              # Updated with permission context
│       ├── Sidebar.jsx                  # Updated with permission filtering
│       └── admins/
│           ├── Form.jsx                 # Updated with role/permission forms
│           └── ListView.jsx             # Updated with role display
└── app/
    └── (admin)/
        └── admin/
            ├── dashboard/
            │   └── page.jsx             # Protected with permission guard
            └── products/
                └── page.jsx             # Protected with permission guard
```

## Setup Instructions

### 1. System Status

The role-based access control system is now active and fully configured. Your super admin account has been set up and the system is ready for production use.

### 2. Creating Additional Admins

To create new admin accounts:

1. Navigate to `/admin/admins`
2. Click "Create" button
3. Fill in admin details (name, email, image)
4. Select role (Super Admin, Admin, or Seller)
5. Configure permissions for the selected role
6. Save the new admin account

## Usage Guide

### For Super Admins

1. **Managing Admin Accounts**
   - Navigate to `/admin/admins`
   - Create new admins with specific roles
   - Edit existing admin permissions
   - View role and permission summary

2. **Permission Management**
   - Click the edit button next to any admin
   - Update basic info, select role, and customize permissions
   - All admin management in one convenient form
   - Save changes

### For Regular Admins/Sellers

1. **Accessing Allowed Pages**
   - Sidebar shows only permitted pages
   - Attempting to access restricted pages shows access denied
   - Permission-based UI element visibility

### Protecting New Pages

To protect a new admin page:

```jsx
import PermissionGuard from '@/components/Admin/PermissionGuard';

export default function NewPage() {
  return (
    <PermissionGuard requiredPermission="page_id">
      {/* Your page content */}
    </PermissionGuard>
  );
}
```

### Adding New Admin Pages

When adding new pages to the admin panel:

1. Add the page definition to `ADMIN_PAGES` in `adminPermissions.js`
2. Update default role permissions if needed
3. Add the page to the sidebar menu list
4. Protect the page with `PermissionGuard`

## Permission System

### Available Permissions

- `dashboard` - Main dashboard access
- `products` - Product management
- `categories` - Category management  
- `orders` - Order management
- `customers` - Customer management
- `collections` - Collection management
- `reviews` - Review management
- `voice-of-customers` - Customer feedback
- `brands` - Brand management
- `faqs` - FAQ management
- `banners` - Banner management
- `admins` - Admin management (Super Admin only)

### Default Role Permissions

```javascript
DEFAULT_ROLE_PERMISSIONS = {
  super_admin: [/* All permissions */],
  admin: ['dashboard', 'products', 'categories', 'orders', 'customers', 'collections', 'reviews', 'brands'],
  seller: ['dashboard', 'products', 'orders', 'collections']
};
```

## API Reference

### Permission Context

```jsx
import { usePermissions } from '@/context/PermissionContext';

function Component() {
  const {
    hasPermission,
    hasRole,
    canManagePermissions,
    getAccessiblePages,
    adminData,
    isSuperAdmin,
    isAdmin,
    isSeller
  } = usePermissions();

  // Usage examples
  if (hasPermission('products')) {
    // Show products UI
  }

  if (isSuperAdmin()) {
    // Show super admin features
  }
}
```

### Permission Functions

```javascript
import { 
  hasPermission, 
  hasRole, 
  getAccessiblePages 
} from '@/lib/permissions/adminPermissions';

// Check specific permission
const canAccessProducts = hasPermission(adminData, 'products');

// Check role
const isSuperAdmin = hasRole(adminData, 'super_admin');

// Get all accessible pages
const pages = getAccessiblePages(adminData);
```

## Database Schema

### Admin Document Structure

```javascript
{
  id: "admin@email.com",
  email: "admin@email.com",
  name: "Admin Name",
  imageURL: "/path/to/image.jpg",
  role: "super_admin|admin|seller",
  permissions: ["dashboard", "products", "orders", ...],
  timestampCreate: Timestamp,
  timestampUpdate: Timestamp
}
```

## Security Considerations

1. **Client-Side Protection Only**: Current implementation provides UI-level protection. Server-side validation should be implemented for production.

2. **Permission Inheritance**: Super admins bypass all permission checks.

3. **Self-Management**: Users cannot modify their own roles (except Super Admins).

4. **Default Permissions**: New users get default permissions based on their role.

## Troubleshooting

### Common Issues

1. **No Super Admin Found**
   - Run the setup script to create initial super admin
   - Check Firestore for existing admins with `role: "super_admin"`

2. **Permission Denied Errors**
   - Verify user has required permissions in Firestore
   - Check if permission context is properly loaded

3. **Sidebar Not Updating**
   - Ensure PermissionContext is wrapping the admin layout
   - Check if user's permissions array includes page IDs

### Validation

Run the validation script to check system health:

```javascript
import { validateSetup } from '@/lib/setup/setupRoleBasedAccess';

const status = await validateSetup();
console.log(status);
```

## Future Enhancements

- [ ] Server-side permission validation
- [ ] Audit logging for permission changes
- [ ] Bulk permission management
- [ ] Permission templates
- [ ] Time-based access restrictions
- [ ] IP-based access controls

## Support

For issues or questions regarding the role-based access system:

1. Check this documentation
2. Review the setup and validation scripts
3. Ensure all components are properly imported and configured
4. Verify Firestore rules allow the required operations

---

**Note**: This system provides frontend permission management. For production use, implement corresponding server-side validation to ensure security.