package com.loginapp.model;

/**
 * Role enum - Defines user roles with hierarchical levels and permissions
 * Provides role-based access control functionality
 */
public enum Role {
    USER(1, "Regular User", new String[]{
                    "VIEW_PROFILE", 
                    "EDIT_PROFILE", 
                    "CHANGE_PASSWORD"
    }),
    
    MODERATOR(2, "Moderator", new String[]{
                    "VIEW_PROFILE", 
                    "EDIT_PROFILE", 
                    "CHANGE_PASSWORD",
                    "MODERATE_CONTENT", 
                    "VIEW_REPORTS", 
                    "SYSTEM_STATS", 
                    "LOGIN_HISTORY",
                    "USER_MANAGEMENT"
    }),
    
    ADMIN(3, "Administrator", new String[]{
                    "VIEW_PROFILE", 
                    "EDIT_PROFILE", 
                    "CHANGE_PASSWORD",
                    "MODERATE_CONTENT", 
                    "VIEW_REPORTS", 
                    "SYSTEM_STATS", 
                    "LOGIN_HISTORY",
                    "USER_MANAGEMENT", 
                    "DELETE_USERS", 
                    "MODIFY_ROLES", 
                    "SYSTEM_SETTINGS"
    });

    private final int level;
    private final String displayName;
    private final String[] permissions;

    /**
     * Constructor for Role enum
     * @param level Hierarchical level of the role
     * @param displayName Human-readable name
     * @param permissions Array of permissions for this role
     */
    Role(int level, String displayName, String[] permissions) {
        this.level = level;
        this.displayName = displayName;
        this.permissions = permissions.clone();
    }

    /**
     * Get the hierarchical level of this role
     * @return Role level (higher number = more permissions)
     */
    public int getLevel() {
        return level;
    }

    /**
     * Get display name for this role
     * @return Human-readable role name
     */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Get all permissions for this role
     * @return Array of permission strings
     */
    public String[] getPermissions() {
        return permissions.clone();
    }

    /**
     * Check if this role has a specific permission
     * @param permission Permission to check
     * @return true if role has permission, false otherwise
     */
    public boolean hasPermission(String permission) {
        if (permission == null) {
            return false;
        }
        
        for (String rolePermission : permissions) {
            if (rolePermission.equals(permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if this role can manage another role
     * @param targetRole Role to check management capability against
     * @return true if can manage, false otherwise
     */
    public boolean canManageRole(Role targetRole) {
        if (targetRole == null) {
            return false;
        }
        
        // Higher level roles can manage lower level roles
        // Same level roles cannot manage each other (except for some specific cases)
        return this.level > targetRole.level;
    }

    /**
     * Get role by display name (case insensitive)
     * @param displayName Display name to search for
     * @return Role if found, null otherwise
     */
    public static Role getByDisplayName(String displayName) {
        if (displayName == null) {
            return null;
        }
        
        for (Role role : Role.values()) {
            if (role.displayName.equalsIgnoreCase(displayName.trim())) {
                return role;
            }
        }
        return null;
    }

    @Override
    public String toString() {
        return displayName + " (Level " + level + ")";
    }
}