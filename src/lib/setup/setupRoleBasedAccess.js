// Setup script for Role-Based Access Control System
// This script helps initialize the system with a super admin and default roles

import { db } from '../firestore/firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { ROLES, DEFAULT_ROLE_PERMISSIONS } from '../permissions/adminPermissions';

/**
 * Creates the first super admin user
 * This should be run once when setting up the system
 */
export const createSuperAdmin = async ({ email, name, imageURL }) => {
  try {
    // Check if super admin already exists
    const adminRef = doc(db, 'admins', email);
    const adminDoc = await getDoc(adminRef);
    
    if (adminDoc.exists()) {
      const existingAdmin = adminDoc.data();
      if (existingAdmin.role === ROLES.SUPER_ADMIN) {
        return { success: false, message: 'Super admin already exists' };
      }
    }

    // Create super admin with all permissions
    const adminData = {
      id: email,
      email: email,
      name: name,
      role: ROLES.SUPER_ADMIN,
      permissions: DEFAULT_ROLE_PERMISSIONS[ROLES.SUPER_ADMIN],
      timestampCreate: Timestamp.now(),
      createdBy: 'system',
      isSystemAdmin: true
    };

    // Add imageURL only if provided
    if (imageURL) {
      adminData.imageURL = imageURL;
    } else {
      adminData.imageURL = '/flame1.png'; // Default image
    }

    await setDoc(adminRef, adminData);

    return { success: true, message: 'Super admin created successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Updates existing admin to have role and permissions
 * Use this to migrate existing admin users to the new role-based system
 */
export const migrateExistingAdmins = async () => {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const adminsRef = collection(db, 'admins');
    const snapshot = await getDocs(adminsRef);
    
    const updates = [];
    
    snapshot.forEach((doc) => {
      const adminData = doc.data();
      
      // Skip if admin already has role and permissions
      if (adminData.role && adminData.permissions) {
        return;
      }
      
      // Determine role based on existing data or default to admin
      let role = ROLES.ADMIN;
      
      // If this is the first admin or has special markers, make them super admin
      if (adminData.isSystemAdmin || adminData.createdBy === 'system') {
        role = ROLES.SUPER_ADMIN;
      }
      
      const permissions = DEFAULT_ROLE_PERMISSIONS[role];
      
      updates.push({
        id: doc.id,
        updates: {
          role: role,
          permissions: permissions,
          timestampUpdate: Timestamp.now(),
          migratedToRoleSystem: true
        }
      });
    });
    
    // Apply updates
    for (const update of updates) {
      const adminRef = doc(db, 'admins', update.id);
      await setDoc(adminRef, update.updates, { merge: true });
    }
    
    return { success: true, message: `Migrated ${updates.length} admins` };
    
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Validates the role-based access system setup
 */
export const validateSetup = async () => {
  try {
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    
    // Check for super admin
    const adminsRef = collection(db, 'admins');
    const superAdminQuery = query(adminsRef, where('role', '==', ROLES.SUPER_ADMIN));
    const superAdminSnapshot = await getDocs(superAdminQuery);
    
    if (superAdminSnapshot.empty) {
      return {
        valid: false,
        issues: ['No super admin found'],
        superAdmins: 0,
        totalAdmins: 0
      };
    }
    
    // Get all admins and validate their structure
    const allAdminsSnapshot = await getDocs(adminsRef);
    let validAdmins = 0;
    let invalidAdmins = [];
    
    allAdminsSnapshot.forEach((doc) => {
      const admin = doc.data();
      
      if (admin.role && admin.permissions && Array.isArray(admin.permissions)) {
        validAdmins++;
      } else {
        invalidAdmins.push(doc.id);
      }
    });
    
    const isValid = invalidAdmins.length === 0;
    
    
    return {
      valid: isValid,
      issues: invalidAdmins.length > 0 ? [`${invalidAdmins.length} admins missing role/permissions`] : [],
      superAdmins: superAdminSnapshot.size,
      totalAdmins: allAdminsSnapshot.size,
      validAdmins,
      invalidAdmins
    };
    
  } catch (error) {
    return {
      valid: false,
      issues: [error.message],
      superAdmins: 0,
      totalAdmins: 0
    };
  }
};

/**
 * Complete setup process
 */
export const setupRoleBasedSystem = async ({ superAdminEmail, superAdminName, superAdminImage }) => {
  try {
    // Step 1: Create super admin
    const superAdminResult = await createSuperAdmin({
      email: superAdminEmail,
      name: superAdminName,
      imageURL: superAdminImage
    });
    
    if (!superAdminResult.success && !superAdminResult.message.includes('already exists')) {
      throw new Error(superAdminResult.message);
    }
    
    // Step 2: Migrate existing admins
    const migrationResult = await migrateExistingAdmins();
    
    // Step 3: Validate setup
    const validation = await validateSetup();
    
    return {
      success: validation.valid,
      summary: {
        superAdmins: validation.superAdmins,
        totalAdmins: validation.totalAdmins,
        validAdmins: validation.validAdmins,
        issues: validation.issues
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

