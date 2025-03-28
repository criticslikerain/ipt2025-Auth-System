export enum Role {
    User = 'User',
    Admin = 'Admin'
}

export interface RolePermissions {
    [Role.User]: Permission[];
    [Role.Admin]: Permission[];
}

export enum Permission {
    // User Management
    ViewUsers = 'view_users',
    CreateUser = 'create_user',
    EditUser = 'edit_user',
    DeleteUser = 'delete_user',
    
    // Profile Management
    ViewProfile = 'view_profile',
    EditProfile = 'edit_profile',
    
    // Account Management
    ChangePassword = 'change_password',
    ResetPassword = 'reset_password',
    
    // Admin Dashboard
    ViewDashboard = 'view_dashboard',
    ViewAnalytics = 'view_analytics',
    ManageSystem = 'manage_system'
}

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
    [Role.User]: [
        Permission.ViewProfile,
        Permission.EditProfile,
        Permission.ChangePassword
    ],
    [Role.Admin]: [
        // Admin has all permissions
        Permission.ViewUsers,
        Permission.CreateUser,
        Permission.EditUser,
        Permission.DeleteUser,
        Permission.ViewProfile,
        Permission.EditProfile,
        Permission.ChangePassword,
        Permission.ResetPassword,
        Permission.ViewDashboard,
        Permission.ViewAnalytics,
        Permission.ManageSystem
    ]
};

export interface RoleInfo {
    name: Role;
    displayName: string;
    description: string;
}

export const ROLE_INFORMATION: Record<Role, RoleInfo> = {
    [Role.User]: {
        name: Role.User,
        displayName: 'User',
        description: 'Standard user with basic permissions'
    },
    [Role.Admin]: {
        name: Role.Admin,
        displayName: 'Administrator',
        description: 'Full system access with all permissions'
    }
};

export class RoleUtils {
    static hasPermission(userRole: Role, requiredPermission: Permission): boolean {
        return DEFAULT_ROLE_PERMISSIONS[userRole].includes(requiredPermission);
    }

    static hasAnyPermission(userRole: Role, requiredPermissions: Permission[]): boolean {
        return requiredPermissions.some(permission => 
            DEFAULT_ROLE_PERMISSIONS[userRole].includes(permission)
        );
    }

    static hasAllPermissions(userRole: Role, requiredPermissions: Permission[]): boolean {
        return requiredPermissions.every(permission => 
            DEFAULT_ROLE_PERMISSIONS[userRole].includes(permission)
        );
    }

    static getRoleDisplayName(role: Role): string {
        return ROLE_INFORMATION[role].displayName;
    }

    static getRoleDescription(role: Role): string {
        return ROLE_INFORMATION[role].description;
    }

    static getAllRoles(): Role[] {
        return Object.values(Role);
    }

    static getRolePermissions(role: Role): Permission[] {
        return DEFAULT_ROLE_PERMISSIONS[role];
    }
}

// Example usage of role-based directive
export interface RoleDirectiveConfig {
    roles?: Role[];
    permissions?: Permission[];
    requireAll?: boolean;
}

// Custom error for role-related issues
export class RoleError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RoleError';
    }
}

// Role validation helper
export function validateUserRole(role: string): role is Role {
    return Object.values(Role).includes(role as Role);
}